/*
 * SPDX-License-Identifier: Apache-2.0
 *
 * The OpenSearch Contributors require contributions made to
 * this file be licensed under the Apache-2.0 license or a
 * compatible open source license.
 *
 * Any modifications Copyright OpenSearch Contributors. See
 * GitHub history for details.
 */

/*
 * Licensed to Elasticsearch B.V. under one or more contributor
 * license agreements. See the NOTICE file distributed with
 * this work for additional information regarding copyright
 * ownership. Elasticsearch B.V. licenses this file to you under
 * the Apache License, Version 2.0 (the "License"); you may
 * not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

import { Plugin, CoreSetup, CoreStart, PluginInitializerContext } from 'src/core/public';
import { BehaviorSubject } from 'rxjs';
import { ISearchSetup, ISearchStart, SearchEnhancements } from './types';

import { handleResponse } from './fetch';
import {
  IOpenSearchSearchRequest,
  IOpenSearchSearchResponse,
  IOpenSearchDashboardsSearchRequest,
  IOpenSearchDashboardsSearchResponse,
  ISearchGeneric,
  ISearchOptions,
  SearchSourceService,
  SearchSourceDependencies,
} from '../../common/search';
import { getCallMsearch } from './legacy';
import { AggsService, AggsStartDependencies } from './aggs';
import { IndexPatternsContract } from '../index_patterns/index_patterns';
import { ISearchInterceptor, SearchInterceptor } from './search_interceptor';
import { SearchUsageCollector, createUsageCollector } from './collectors';
import { UsageCollectionSetup } from '../../../usage_collection/public';
import { opensearchdsl, opensearchRawResponse } from './expressions';
import { ExpressionsSetup } from '../../../expressions/public';
import { ConfigSchema } from '../../config';
import {
  SHARD_DELAY_AGG_NAME,
  getShardDelayBucketAgg,
} from '../../common/search/aggs/buckets/shard_delay';
import { aggShardDelay } from '../../common/search/aggs/buckets/shard_delay_fn';
import {
  DataFrameService,
  IDataFrame,
  IDataFrameResponse,
  createDataFrameCache,
  dataFrameToSpec,
} from '../../common/data_frames';
import { getQueryService, getUiService } from '../services';
import { UI_SETTINGS } from '../../common';

/** @internal */
export interface SearchServiceSetupDependencies {
  expressions: ExpressionsSetup;
  usageCollection?: UsageCollectionSetup;
}

/** @internal */
export interface SearchServiceStartDependencies {
  fieldFormats: AggsStartDependencies['fieldFormats'];
  indexPatterns: IndexPatternsContract;
}

export class SearchService implements Plugin<ISearchSetup, ISearchStart> {
  private readonly aggsService = new AggsService();
  private readonly searchSourceService = new SearchSourceService();
  private readonly dfCache = createDataFrameCache();
  private searchInterceptor!: ISearchInterceptor;
  private defaultSearchInterceptor!: ISearchInterceptor;
  private usageCollector?: SearchUsageCollector;

  constructor(private initializerContext: PluginInitializerContext<ConfigSchema>) {}

  public setup(
    { http, getStartServices, notifications, uiSettings }: CoreSetup,
    { expressions, usageCollection }: SearchServiceSetupDependencies
  ): ISearchSetup {
    this.usageCollector = createUsageCollector(getStartServices, usageCollection);

    /**
     * A global object that intercepts all searches and provides convenience methods for cancelling
     * all pending search requests, as well as getting the number of pending search requests.
     */
    this.searchInterceptor = new SearchInterceptor({
      toasts: notifications.toasts,
      http,
      uiSettings,
      startServices: getStartServices(),
      usageCollector: this.usageCollector!,
    });
    this.defaultSearchInterceptor = this.searchInterceptor;

    expressions.registerFunction(opensearchdsl);
    expressions.registerType(opensearchRawResponse);

    const aggs = this.aggsService.setup({
      registerFunction: expressions.registerFunction,
      uiSettings,
    });

    if (this.initializerContext.config.get().search.aggs.shardDelay.enabled) {
      aggs.types.registerBucket(SHARD_DELAY_AGG_NAME, getShardDelayBucketAgg);
      expressions.registerFunction(aggShardDelay);
    }

    return {
      aggs,
      usageCollector: this.usageCollector!,
      __enhance: (enhancements: SearchEnhancements) => {
        this.searchInterceptor = enhancements.searchInterceptor;
      },
    };
  }

  public start(
    { application, http, notifications, uiSettings }: CoreStart,
    { fieldFormats, indexPatterns }: SearchServiceStartDependencies
  ): ISearchStart {
    const search = ((request, options) => {
      const selectedLanguage = getQueryService().queryString.getQuery().language;
      const uiService = getUiService();
      const enhancement = uiService.Settings.getQueryEnhancements(selectedLanguage);
      uiService.Settings.setUiOverridesByUserQueryLanguage(selectedLanguage);
      const isEnhancedEnabled = uiSettings.get(UI_SETTINGS.QUERY_ENHANCEMENTS_ENABLED);

      if (enhancement) {
        if (!isEnhancedEnabled) {
          notifications.toasts.addWarning(
            `Query enhancements are disabled. Please enable to use: ${selectedLanguage}.`
          );
        }
        return enhancement.search.search(request, options);
      }
      return this.defaultSearchInterceptor.search(request, options);
    }) as ISearchGeneric;

    const loadingCount$ = new BehaviorSubject(0);
    http.addLoadingCountSource(loadingCount$);

    const dfService: DataFrameService = {
      get: () => this.dfCache.get(),
      set: async (dataFrame: IDataFrame) => {
        if (this.dfCache.get() && this.dfCache.get()?.name !== dataFrame.name) {
          indexPatterns.clearCache(this.dfCache.get()!.name, false);
        }
        if (
          dataFrame.meta &&
          dataFrame.meta.queryConfig &&
          'dataSource' in dataFrame.meta.queryConfig
        ) {
          const dataSource = await indexPatterns.findDataSourceByTitle(
            dataFrame.meta.queryConfig.dataSource
          );
          dataFrame.meta.queryConfig.dataSourceId = dataSource?.id;
        }
        this.dfCache.set(dataFrame);
        const dataSetName = `${dataFrame.meta?.queryConfig?.dataSourceId ?? ''}.${dataFrame.name}`;
        const existingIndexPattern = await indexPatterns.get(dataSetName, true);
        const dataSet = await indexPatterns.create(
          dataFrameToSpec(dataFrame, existingIndexPattern?.id ?? dataSetName),
          !existingIndexPattern?.id
        );
        await indexPatterns.refreshFields(dataSet, true);
        indexPatterns.saveToCache(dataSetName, dataSet);
      },
      clear: () => {
        if (this.dfCache.get() === undefined) return;
        this.dfCache.clear();
      },
    };

    const searchSourceDependencies: SearchSourceDependencies = {
      getConfig: uiSettings.get.bind(uiSettings),
      search: <
        SearchStrategyRequest extends IOpenSearchDashboardsSearchRequest = IOpenSearchSearchRequest,
        SearchStrategyResponse extends
          | IOpenSearchDashboardsSearchResponse
          | IDataFrameResponse = IOpenSearchSearchResponse
      >(
        request: SearchStrategyRequest,
        options: ISearchOptions
      ) => {
        return search(request, options).toPromise() as Promise<SearchStrategyResponse>;
      },
      onResponse: handleResponse,
      legacy: {
        callMsearch: getCallMsearch({ http }),
        loadingCount$,
      },
      df: dfService,
    };

    return {
      aggs: this.aggsService.start({ fieldFormats, uiSettings }),
      search,
      showError: (e: Error) => {
        this.searchInterceptor.showError(e);
      },
      searchSource: this.searchSourceService.start(indexPatterns, searchSourceDependencies),
      __enhance: (enhancements: SearchEnhancements) => {
        this.searchInterceptor = enhancements.searchInterceptor;
      },
      getDefaultSearchInterceptor: () => this.defaultSearchInterceptor,
      df: dfService,
    };
  }

  public stop() {
    this.aggsService.stop();
    this.searchSourceService.stop();
  }
}
