/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import { i18n } from '@osd/i18n';
import { DashboardConstants } from '../../dashboard_constants';

// Add some basic breadcrumbs logic for dashboard listing
// TODO: Need to revisit the breadcrumbs logic to take unsaved/saved changes into account

export function getLandingBreadcrumbs() {
  return [
    {
      text: i18n.translate('dashboard.dashboardAppBreadcrumbsTitle', {
        defaultMessage: 'Dashboard',
      }),
      href: `#${DashboardConstants.LANDING_PAGE_PATH}`,
    },
  ];
}

export function getExistingDashboardBreadcrumbs(dashboardTitle: string) {
  return [
    ...getLandingBreadcrumbs(),
    {
      text: i18n.translate('dashboard.strings.dashboardEditTitle', {
        defaultMessage: 'Editing {title}',
        values: { title: dashboardTitle },
      }),
    },
  ];
}

export function getNewDashboardBreadcrumbs() {
  return [
    ...getLandingBreadcrumbs(),
    {
      text: i18n.translate('dashboard.savedDashboard.newDashboardTitle', {
        defaultMessage: 'New Dashboard',
      }),
    },
  ];
}
