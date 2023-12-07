/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useMemo, useState } from 'react';
import { TimeRange, Query, doesKueryExpressionHaveLuceneSyntaxError } from '../../../../../data/common';
import { AppMountParameters, Toast } from '../../../../../../core/public';
import { PLUGIN_ID } from '../../../../common';
import { toMountPoint, useOpenSearchDashboards, withOpenSearchDashboards } from '../../../../../opensearch_dashboards_react/public';
import { DiscoverViewServices } from '../../../build_services';
import { IndexPattern } from '../../../opensearch_dashboards_services';
import { getTopNavLinks } from '../../components/top_nav/get_top_nav_links';
import { useDiscoverContext } from '../context';
import { getRootBreadcrumbs } from '../../helpers/breadcrumbs';
import { opensearchFilters, connectStorageToQueryState } from '../../../../../data/public';
import { EuiButton, EuiFlexGroup, EuiFlexItem, EuiLink } from '@elastic/eui';
import { PersistedLog, getQueryLog } from '../../../../../data/public/query';
import { FormattedMessage } from 'react-intl';
import { i18n } from '@osd/i18n';
import DiscoverQueryStringInputUI from './discover_query_bar';

const QueryStringInput = withOpenSearchDashboards(DiscoverQueryStringInputUI);

export interface TopNavProps {
  opts: {
    setHeaderActionMenu: AppMountParameters['setHeaderActionMenu'];
    onQuerySubmit: (payload: { dateRange?: TimeRange; query?: Query }, isUpdate?: boolean) => void;
  };
}

export const TopNav = ({ opts }: TopNavProps) => {
  const { services } = useOpenSearchDashboards<DiscoverViewServices>();
  const { uiSettings, notifications, docLinks } = services
  const { inspectorAdapters, savedSearch, indexPattern } = useDiscoverContext();
  const [indexPatterns, setIndexPatterns] = useState<IndexPattern[] | undefined>(undefined);
  const [isQueryInputFocused, setIsQueryInputFocused] = useState(false);
  const [query, setQuery] = useState<Query | undefined>({query:'', language:''})
  //const queryLanguage = props.query && props.query.language;
  const osdDQLDocs: string = docLinks!.links.opensearchDashboards.dql.base;
  // const persistedLog: PersistedLog | undefined = React.useMemo(
  //   () =>
  //     queryLanguage && uiSettings && storage && appName
  //       ? getQueryLog(uiSettings!, storage, appName, queryLanguage)
  //       : undefined,
  //   [appName, queryLanguage, uiSettings, storage]
  // );

  const {
    navigation: {
      ui: { TopNavMenu },
    },
    core: {
      application: { getUrlForApp },
    },
    data,
    chrome,
    osdUrlStateStorage,
  } = services;

  const topNavLinks = savedSearch ? getTopNavLinks(services, inspectorAdapters, savedSearch) : [];

  connectStorageToQueryState(services.data.query, osdUrlStateStorage, {
    filters: opensearchFilters.FilterStateStore.APP_STATE,
    query: true,
  });

  useEffect(() => {
    let isMounted = true;
    const getDefaultIndexPattern = async () => {
      await data.indexPatterns.ensureDefaultIndexPattern();
      const defaultIndexPattern = await data.indexPatterns.getDefault();

      if (!isMounted) return;

      setIndexPatterns(defaultIndexPattern ? [defaultIndexPattern] : undefined);
    };

    getDefaultIndexPattern();

    return () => {
      isMounted = false;
    };
  }, [data.indexPatterns]);

  useEffect(() => {
    const pageTitleSuffix = savedSearch?.id && savedSearch.title ? `: ${savedSearch.title}` : '';
    chrome.docTitle.change(`Discover${pageTitleSuffix}`);

    if (savedSearch?.id) {
      chrome.setBreadcrumbs([...getRootBreadcrumbs(), { text: savedSearch.title }]);
    } else {
      chrome.setBreadcrumbs([...getRootBreadcrumbs()]);
    }
  }, [chrome, getUrlForApp, savedSearch?.id, savedSearch?.title]);

  const showDatePicker = useMemo(() => (indexPattern ? indexPattern.isTimeBased() : false), [
    indexPattern,
  ]);

  function onChangeQueryInputFocus(isFocused: boolean) {
    setIsQueryInputFocused(isFocused);
  }

  const onQueryBarChange = (query?: Query ) => {
    setQuery(query)
    // if (this.props.onQueryChange) {
    //   this.props.onQueryChange(queryAndDateRange);
    // }
  };

  const onLuceneSyntaxWarningOptOut = (toast: Toast) => {
    if (!storage) return;
    storage.set('opensearchDashboards.luceneSyntaxWarningOptOut', true);
    notifications!.toasts.remove(toast);
  }

  const handleLuceneSyntaxWarning = (queryCombo?: Query) => {
    if (!queryCombo) return;
    const { query, language } = queryCombo;
    if (
      language === 'kuery' &&
      typeof query === 'string' &&
      //(!storage || !storage.get('opensearchDashboards.luceneSyntaxWarningOptOut')) &&
      doesKueryExpressionHaveLuceneSyntaxError(query)
    ) {
      const toast = notifications!.toasts.addWarning({
        title: i18n.translate('data.query.queryBar.luceneSyntaxWarningTitle', {
          defaultMessage: 'Lucene syntax warning',
        }),
        text: toMountPoint(
          <div>
            <p>
              <FormattedMessage
                id="data.query.queryBar.luceneSyntaxWarningMessage"
                defaultMessage="It looks like you may be trying to use Lucene query syntax, although you
               have opensearchDashboards Query Language (DQL) selected. Please review the DQL docs {link}."
                values={{
                  link: (
                    <EuiLink href={osdDQLDocs} target="_blank">
                      <FormattedMessage
                        id="data.query.queryBar.syntaxOptionsDescription.docsLinkText"
                        defaultMessage="here"
                      />
                    </EuiLink>
                  ),
                }}
              />
            </p>
            <EuiFlexGroup justifyContent="flexEnd" gutterSize="s">
              <EuiFlexItem grow={false}>
                <EuiButton size="s" onClick={() => onLuceneSyntaxWarningOptOut(toast)}>
                  <FormattedMessage
                    id="data.query.queryBar.luceneSyntaxWarningOptOutText"
                    defaultMessage="Don't show again"
                  />
                </EuiButton>
              </EuiFlexItem>
            </EuiFlexGroup>
          </div>
        ),
      });
    }
  }

  const onSubmit = (query?: Query) => {
    handleLuceneSyntaxWarning(query);

    opts.onQuerySubmit({query});
  }

  return (
    <EuiFlexGroup>
    <EuiFlexItem>
      <QueryStringInput
          indexPatterns={indexPattern ? [indexPattern] : []}
          prepend
          query={query!}
          onChange={onQueryBarChange}
          //onChangeQueryInputFocus={onChangeQueryInputFocus}
          onSubmit={onSubmit}
          //persistedLog={persistedLog}
        />
    </EuiFlexItem>
    <EuiFlexItem>
      <TopNavMenu
      appName={PLUGIN_ID}
      config={topNavLinks}
      showSearchBar
      showQueryBar
      showQueryInput={false}
      showDatePicker={showDatePicker}
      showSaveQuery
      useDefaultBehaviors
      setMenuMountPoint={opts.setHeaderActionMenu}
      indexPatterns={indexPattern ? [indexPattern] : indexPatterns}
      onQuerySubmit={opts.onQuerySubmit}
      />
    </EuiFlexItem>
    </EuiFlexGroup>
  );
};
