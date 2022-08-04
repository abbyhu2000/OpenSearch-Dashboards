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
import { first, take } from 'rxjs/operators';
import { Agent as HttpsAgent } from 'https';
import { Branding } from 'src/core/types';
import Axios from 'axios';
// @ts-expect-error untyped internal module used to prevent axios from using xhr adapter in tests
import AxiosHttpAdapter from 'axios/lib/adapters/http';
import { CoreContext } from '../core_context';
import { BrandingValidation, BrandingAssignment } from './types';
import { OpenSearchDashboardsConfigType } from '../opensearch_dashboards_config';
import { HttpConfigType } from '../http/http_config';
import { SslConfig } from '../http/ssl_config';
import { LoggerFactory } from '../logging';

const DEFAULT_TITLE = 'OpenSearch Dashboards';

/** @internal */
export class BrandingService {
  constructor(private readonly coreContext: CoreContext) {
    this.logger = this.coreContext.logger;
  }
  private logger: LoggerFactory;
  private httpsAgent?: HttpsAgent;

  public async setup(darkMode: boolean, uiPublicUrl: string) {
    const [opensearchDashboardsConfig, serverConfig] = await Promise.all([
      this.coreContext.configService
        .atPath<OpenSearchDashboardsConfigType>('opensearchDashboards')
        .pipe(first())
        .toPromise(),
      this.coreContext.configService.atPath<HttpConfigType>('server').pipe(first()).toPromise(),
    ]);

    this.setupHttpAgent(serverConfig as HttpConfigType);

    const brandingAssignment = await this.assignBrandingConfig(
      darkMode,
      opensearchDashboardsConfig as OpenSearchDashboardsConfigType
    );

    const brandingData: Branding = {
      darkMode,
      assetFolderUrl: `${uiPublicUrl}/default_branding`,
      logo: this.darkModeLogic(
        darkMode,
        brandingAssignment.logoDefault,
        brandingAssignment.logoDarkmode
      ),

      mark: this.darkModeLogic(
        darkMode,
        brandingAssignment.markDefault,
        brandingAssignment.markDarkmode
      ),
      loadingLogo: {
        url: this.loadingLogoLogic(darkMode, brandingAssignment).loadinglogo,
        loadBar: this.loadingLogoLogic(darkMode, brandingAssignment).loadBar,
      },
      faviconUrl: brandingAssignment.favicon,
      applicationTitle: brandingAssignment.applicationTitle,
      useExpandedHeader: brandingAssignment.useExpandedHeader,
    };

    return brandingData;
  }

  public async stop() {}

  private darkModeLogic(darkMode: boolean, defaultUrl?: string, darkmodeUrl?: string) {
    const defaultImg = defaultUrl ?? undefined;
    const darkImg = darkmodeUrl ?? defaultUrl ?? undefined;
    return darkMode ? darkImg : defaultImg;
  }

  private loadingLogoLogic(
    darkMode: boolean,
    { markDefault, markDarkmode, loadingLogoDefault, loadingLogoDarkmode }: BrandingAssignment
  ) {
    const defaultLoading = loadingLogoDefault ?? markDefault ?? undefined;
    const darkLoading =
      loadingLogoDarkmode ?? loadingLogoDefault ?? markDarkmode ?? markDefault ?? undefined;
    const loadinglogo = darkMode ? darkLoading : defaultLoading;
    const loadBar = !loadingLogoDefault && defaultLoading ? true : false;
    return { loadinglogo, loadBar };
  }

  /**
   * Setups HTTP Agent if SSL is enabled to pass SSL config
   * values to Axios to make requests in while validating
   * resources.
   *
   * @param {Readonly<HttpConfigType>} httpConfig
   */
  private setupHttpAgent(httpConfig: Readonly<HttpConfigType>) {
    if (!httpConfig.ssl?.enabled) return;
    try {
      const sslConfig = new SslConfig(httpConfig.ssl);
      this.httpsAgent = new HttpsAgent({
        ca: sslConfig.certificateAuthorities,
        cert: sslConfig.certificate,
        key: sslConfig.key,
        passphrase: sslConfig.keyPassphrase,
        rejectUnauthorized: false,
      });
    } catch (e) {
      this.logger.get('branding').error('HTTP agent failed to setup for SSL.');
    }
  }

  /**
   * Assign values for branding related configurations based on branding validation
   * by calling checkBrandingValid(). For dark mode URLs, add additonal validation
   * to see if there is a valid default mode URL exist first. If URL is valid, pass in
   * the actual URL; if not, pass in undefined.
   *
   * @param {boolean} darkMode
   * @param {Readonly<OpenSearchDashboardsConfigType>} opensearchDashboardsConfig
   * @returns {BrandingAssignment} valid URLs or undefined assigned for each branding configs
   */
  private assignBrandingConfig = async (
    darkMode: boolean,
    opensearchDashboardsConfig: Readonly<OpenSearchDashboardsConfigType>
  ): Promise<BrandingAssignment> => {
    const branding = opensearchDashboardsConfig.branding;

    const skipValidation = false;
    const logoDefaultConfig = branding.logo.defaultUrl;
    const logoDarkmodeConfig = branding.logo.darkModeUrl;
    const markDefaultConfig = branding.mark.defaultUrl;
    const markDarkmodeConfig = branding.mark.darkModeUrl;
    const loadingLogoDefaultConfig = branding.loadingLogo.defaultUrl;
    const loadingLogoDarkmodeConfig = branding.loadingLogo.darkModeUrl;
    const faviconConfig = branding.faviconUrl;
    const applicationTitleConfig = branding.applicationTitle;

    // use expanded menu by default unless explicitly set to false
    const { useExpandedHeader = true } = branding;

    /* if(skipValidation){
      const branding = opensearchDashboardsConfig.branding;
      const brandingWithoutValidation: BrandingAssignment= {
        branding.logo.defaultUrl as logoDefaultConfig
        logoDarkmodeConfig,
        markDefaultConfig,
        markDarkmodeConfig,
        loadingLogoDefaultConfig,
        loadingLogoDarkmodeConfig,
        faviconConfig,
        applicationTitleConfig,
        useExpandedHeader,
      }
      return brandingWithoutValidation;
    }*/

    const brandingValidation: BrandingValidation = await this.checkBrandingValid(
      skipValidation,
      darkMode,
      opensearchDashboardsConfig
    );

    // assign default mode URL based on the brandingValidation function result
    const logoDefault = brandingValidation.isLogoDefaultValid ? logoDefaultConfig : undefined;

    const markDefault = brandingValidation.isMarkDefaultValid ? markDefaultConfig : undefined;

    const loadingLogoDefault = brandingValidation.isLoadingLogoDefaultValid
      ? loadingLogoDefaultConfig
      : undefined;

    // assign dark mode URLs based on brandingValidation function result
    let logoDarkmode = brandingValidation.isLogoDarkmodeValid ? logoDarkmodeConfig : undefined;

    let markDarkmode = brandingValidation.isMarkDarkmodeValid ? markDarkmodeConfig : undefined;

    let loadingLogoDarkmode = brandingValidation.isLoadingLogoDarkmodeValid
      ? loadingLogoDarkmodeConfig
      : undefined;

    /**
     * For dark mode URLs, we added another validation:
     * user can only provide a dark mode URL after providing a valid default mode URL,
     * If user provides a valid dark mode URL but fails to provide a valid default mode URL,
     * return undefined for the dark mode URL
     */
    if (!skipValidation && logoDarkmode && !logoDefault) {
      this.logger
        .get('branding')
        .error('Must provide a valid logo default mode URL before providing a logo dark mode URL');
      logoDarkmode = undefined;
    }

    if (!skipValidation && markDarkmode && !markDefault) {
      this.logger
        .get('branding')
        .error('Must provide a valid mark default mode URL before providing a mark dark mode URL');
      markDarkmode = undefined;
    }

    if (!skipValidation && loadingLogoDarkmode && !loadingLogoDefault) {
      this.logger
        .get('branding')
        .error(
          'Must provide a valid loading logo default mode URL before providing a loading logo dark mode URL'
        );
      loadingLogoDarkmode = undefined;
    }

    // assign favicon based on brandingValidation function result
    const favicon = brandingValidation.isFaviconValid ? faviconConfig : undefined;

    // assign application title based on brandingValidation function result
    const applicationTitle = brandingValidation.isTitleValid
      ? applicationTitleConfig
      : DEFAULT_TITLE;

    const brandingAssignment: BrandingAssignment = {
      logoDefault,
      logoDarkmode,
      markDefault,
      markDarkmode,
      loadingLogoDefault,
      loadingLogoDarkmode,
      favicon,
      applicationTitle,
      useExpandedHeader,
    };

    return brandingAssignment;
  };

  /**
   * Assign boolean values for branding related configurations to indicate if
   * user inputs valid or invalid URLs by calling isUrlValid() function. Also
   * check if title is valid by calling isTitleValid() function.
   *
   * @param {boolean} darkMode
   * @param {Readonly<OpenSearchDashboardsConfigType>} opensearchDashboardsConfig
   * @returns {BrandingValidation} indicate valid/invalid URL for each branding config
   */
  private checkBrandingValid = async (
    skipValidation: boolean,
    darkMode: boolean,
    opensearchDashboardsConfig: Readonly<OpenSearchDashboardsConfigType>
  ): Promise<BrandingValidation> => {
    const branding = opensearchDashboardsConfig.branding;
    const isLogoDefaultValid = skipValidation
      ? true
      : await this.isUrlValid(branding.logo.defaultUrl, 'logo default');

    const isLogoDarkmodeValid = skipValidation
      ? true
      : darkMode
      ? await this.isUrlValid(branding.logo.darkModeUrl, 'logo darkMode')
      : false;

    const isMarkDefaultValid = skipValidation
      ? true
      : await this.isUrlValid(branding.mark.defaultUrl, 'mark default');

    const isMarkDarkmodeValid = skipValidation
      ? true
      : darkMode
      ? await this.isUrlValid(branding.mark.darkModeUrl, 'mark darkMode')
      : false;

    const isLoadingLogoDefaultValid = skipValidation
      ? true
      : await this.isUrlValid(branding.loadingLogo.defaultUrl, 'loadingLogo default');

    const isLoadingLogoDarkmodeValid = skipValidation
      ? true
      : darkMode
      ? await this.isUrlValid(branding.loadingLogo.darkModeUrl, 'loadingLogo darkMode')
      : false;

    const isFaviconValid = skipValidation
      ? true
      : await this.isUrlValid(branding.faviconUrl, 'favicon');

    const isTitleValid = skipValidation
      ? true
      : this.isTitleValid(branding.applicationTitle, 'applicationTitle');

    const brandingValidation: BrandingValidation = {
      isLogoDefaultValid,
      isLogoDarkmodeValid,
      isMarkDefaultValid,
      isMarkDarkmodeValid,
      isLoadingLogoDefaultValid,
      isLoadingLogoDarkmodeValid,
      isFaviconValid,
      isTitleValid,
    };

    return brandingValidation;
  };

  /**
   * Validation function for URLs. Use Axios to call URL and check validity.
   * Also needs to be ended with png, svg, gif, PNG, SVG and GIF.
   *
   * @param {string} url
   * @param {string} configName
   * @returns {boolean} indicate if the URL is valid/invalid
   */
  public isUrlValid = async (url: string, configName?: string): Promise<boolean> => {
    if (url === '/') {
      return false;
    }
    if (url.match(/\.(png|svg|gif|PNG|SVG|GIF)$/) === null) {
      this.logger.get('branding').error(`${configName} config is invalid. Using default branding.`);
      return false;
    }
    return await Axios.get(url, {
      httpsAgent: this.httpsAgent,
      adapter: AxiosHttpAdapter,
      maxRedirects: 0,
    })
      .then(() => {
        return true;
      })
      .catch(() => {
        this.logger
          .get('branding')
          .error(`${configName} URL was not found or invalid. Using default branding.`);
        return false;
      });
  };

  /**
   * Validation function for applicationTitle config.
   * Title length needs to be between 1 to 36 letters.
   *
   * @param {string} title
   * @param {string} configName
   * @returns {boolean} indicate if user input title is valid/invalid
   */
  public isTitleValid = (title: string, configName?: string): boolean => {
    if (!title) {
      return false;
    }
    if (title.length > 36) {
      this.logger
        .get('branding')
        .error(
          `${configName} config is not found or invalid. Title length should be between 1 to 36 characters. Using default title.`
        );
      return false;
    }
    return true;
  };
}
