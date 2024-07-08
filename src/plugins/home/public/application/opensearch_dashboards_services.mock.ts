/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import { coreMock } from '../../../../core/public/mocks';
import { urlForwardingPluginMock } from '../../../url_forwarding/public/mocks';
import {
  EnvironmentService,
  FeatureCatalogueRegistry,
  SectionTypeService,
  TutorialService,
} from '../services';
import { telemetryPluginMock } from '../../../telemetry/public/mocks';
import { homePluginMock } from '../mocks/mocks';
import { configSchema } from '../../config';

export const getMockedServices = () => {
  const coreMocks = coreMock.createStart();
  const urlForwarding = urlForwardingPluginMock.createStartContract();
  const homePlugin = homePluginMock.createStartContract();
  return {
    ...coreMocks,
    ...homePlugin,
    telemetry: telemetryPluginMock.createStartContract(),
    indexPatternService: jest.fn(),
    dataSource: {
      dataSourceEnabled: false,
      hideLocalCluster: false,
      noAuthenticationTypeEnabled: false,
      usernamePasswordAuthEnabled: false,
      awsSigV4AuthEnabled: false,
    },
    opensearchDashboardsVersion: '',
    urlForwarding,
    savedObjectsClient: coreMocks.savedObjects.client,
    toastNotifications: coreMocks.notifications.toasts,
    banners: coreMocks.overlays.banners,
    trackUiMetric: jest.fn(),
    getBasePath: jest.fn(),
    addBasePath: jest.fn(),
    environmentService: new EnvironmentService(),
    tutorialService: new TutorialService(),
    homeConfig: configSchema.validate({}),
    featureCatalogue: new FeatureCatalogueRegistry(),
    sectionTypes: new SectionTypeService(),
  };
};
