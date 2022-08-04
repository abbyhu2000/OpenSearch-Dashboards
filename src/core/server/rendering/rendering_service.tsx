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

import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { first, take } from 'rxjs/operators';
import { i18n } from '@osd/i18n';

// @ts-expect-error untyped internal module used to prevent axios from using xhr adapter in tests
import AxiosHttpAdapter from 'axios/lib/adapters/http';
import { UiPlugins } from '../plugins';
import { CoreContext } from '../core_context';
import { Template } from './views';
import {
  IRenderOptions,
  RenderingSetupDeps,
  InternalRenderingServiceSetup,
  RenderingMetadata,
} from './types';
import { BrandingService } from '../branding_service';

/** @internal */
export class RenderingService {
  private readonly branding: BrandingService;
  constructor(private readonly coreContext: CoreContext) {
    this.branding = new BrandingService(coreContext);
  }

  public async setup({
    http,
    status,
    uiPlugins,
  }: RenderingSetupDeps): Promise<InternalRenderingServiceSetup> {
    return {
      render: async (
        request,
        uiSettings,
        { includeUserSettings = true, vars }: IRenderOptions = {}
      ) => {
        const env = {
          mode: this.coreContext.env.mode,
          packageInfo: this.coreContext.env.packageInfo,
        };
        const basePath = http.basePath.get(request);
        const uiPublicUrl = `${basePath}/ui`;
        const serverBasePath = http.basePath.serverBasePath;
        const settings = {
          defaults: uiSettings.getRegistered(),
          user: includeUserSettings ? await uiSettings.getUserProvided() : {},
        };
        const darkMode = settings.user?.['theme:darkMode']?.userValue
          ? Boolean(settings.user['theme:darkMode'].userValue)
          : false;
        const branding = await this.branding.setup(darkMode, uiPublicUrl);

        const metadata: RenderingMetadata = {
          strictCsp: http.csp.strict,
          uiPublicUrl,
          bootstrapScriptUrl: `${basePath}/bootstrap.js`,
          i18n: i18n.translate,
          locale: i18n.getLocale(),
          darkMode,
          injectedMetadata: {
            version: env.packageInfo.version,
            buildNumber: env.packageInfo.buildNum,
            branch: env.packageInfo.branch,
            basePath,
            serverBasePath,
            env,
            anonymousStatusPage: status.isStatusPageAnonymous(),
            i18n: {
              translationsUrl: `${basePath}/translations/${i18n.getLocale()}.json`,
            },
            csp: { warnLegacyBrowsers: http.csp.warnLegacyBrowsers },
            vars: vars ?? {},
            uiPlugins: await Promise.all(
              [...uiPlugins.public].map(async ([id, plugin]) => ({
                id,
                plugin,
                config: await this.getUiConfig(uiPlugins, id),
              }))
            ),
            legacyMetadata: {
              uiSettings: settings,
            },
          },
        };

        return `<!DOCTYPE html>${renderToStaticMarkup(
          <Template metadata={metadata} branding={branding} />
        )}`;
      },
    };
  }

  public async stop() {}

  private async getUiConfig(uiPlugins: UiPlugins, pluginId: string) {
    const browserConfig = uiPlugins.browserConfigs.get(pluginId);

    return ((await browserConfig?.pipe(take(1)).toPromise()) ?? {}) as Record<string, any>;
  }
}
