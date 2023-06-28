/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import { i18n } from '@osd/i18n';
import { EventEmitter } from 'events';
import { useEffect, useRef, useState } from 'react';
import {
  redirectWhenMissing,
  SavedObjectNotFound,
} from '../../../../../opensearch_dashboards_utils/public';
import { DashboardConstants } from '../../../dashboard_constants';
import { DashboardServices, IEditorController, SavedDashboardInstance } from '../../types';

/**
 * This effect is responsible for instantiating a saved dashboard or creating a new one
 * using url parameters, embedding and destroying it in DOM
 */
export const useSavedDashboardInstance = (
  services: DashboardServices,
  eventEmitter: EventEmitter,
  isChromeVisible: boolean | undefined,
  dashboardIdFromUrl: string | undefined
) => {
  //const [savedDashboardInstance, setSavedDashboardInstance] = useState<any>();
  const [state, setState] = useState<{
    savedDashboardInstance?: SavedDashboardInstance;
    dashboardEditorController?: IEditorController;
  }>
  const dashboardEditorRef = useRef<HTMLDivElement>(null)
  const dashboardId = useRef('');

  useEffect(() => {
    const {
      application: { navigateToApp },
      chrome,
      history,
      http: { basePath },
      notifications,
      savedDashboards,
      toastNotifications,
    } = services;

    const getSavedDashboardInstance = async () => {
      try {
        let savedDashboardInstance: SavedDashboardInstance;
        if (history.location.pathname === '/create') {
          try {
            //savedDashboardInstance = await savedDashboards.get();
            savedDashboardInstance = await getDashboardInstance()
          } catch {
            redirectWhenMissing({
              history,
              basePath,
              navigateToApp,
              mapping: {
                dashboard: DashboardConstants.LANDING_PAGE_PATH,
              },
              toastNotifications: notifications.toasts,
            });
          }
        } else if (dashboardIdFromUrl) {
          try {
            //savedDashboardInstance = await savedDashboards.get(dashboardIdFromUrl);
            savedDashboardInstance = await getDashboardInstance(dashboardIdFromUr)

            // Update time filter to match the saved dashboard if time restore has been set to true when saving the dashboard
            // We should only set the time filter according to time restore once when we are loading the dashboard
            if (savedDashboardInstance.timeRestore) {
              if (savedDashboardInstance.timeFrom && savedDashboardInstance.timeTo) {
                services.data.query.timefilter.timefilter.setTime({
                  from: savedDashboardInstance.timeFrom,
                  to: savedDashboardInstance.timeTo,
                });
              }
              if (savedDashboardInstance.refreshInterval) {
                services.data.query.timefilter.timefilter.setRefreshInterval(
                  savedDashboardInstance.refreshInterval
                );
              }
            }

            chrome.recentlyAccessed.add(
              savedDashboardInstance.getFullPath(),
              savedDashboardInstance.title,
              dashboardIdFromUrl
            );
          } catch (error) {
            // Preserve BWC of v5.3.0 links for new, unsaved dashboards.
            // See https://github.com/elastic/kibana/issues/10951 for more context.
            if (error instanceof SavedObjectNotFound && dashboardIdFromUrl === 'create') {
              // Note preserve querystring part is necessary so the state is preserved through the redirect.
              history.replace({
                ...history.location, // preserve query,
                pathname: DashboardConstants.CREATE_NEW_DASHBOARD_URL,
              });

              notifications.toasts.addWarning(
                i18n.translate('dashboardNew.urlWasRemovedInSixZeroWarningMessage', {
                  defaultMessage:
                    'The url "dashboard/create" was removed in 6.0. Please update your bookmarks.',
                })
              );
              return new Promise(() => {});
            } else {
              // E.g. a corrupt or deleted dashboard
              notifications.toasts.addDanger(error.message);
              history.push(DashboardConstants.LANDING_PAGE_PATH);
              return new Promise(() => {});
            }
          }
        }

        const { embeddableHandler, savedDashboard, dashboard} = savedDashboardInstance;

        setSavedDashboardInstance(savedDashboard);
      } catch (error) {
        toastNotifications.addWarning({
          title: i18n.translate('dashboardNew.createDashboard.failedToLoadErrorMessage', {
            defaultMessage: 'Failed to load the dashboard',
          }),
        });
        history.replace(DashboardConstants.LANDING_PAGE_PATH);
      }
    };

    if (isChromeVisible === undefined) {
      // waiting for specifying chrome
      return;
    }

    if (!dashboardId.current) {
      dashboardId.current = dashboardIdFromUrl || 'new';
      getSavedDashboardInstance();
    } else if (
      dashboardIdFromUrl &&
      dashboardId.current !== dashboardIdFromUrl &&
      savedDashboardInstance?.id !== dashboardIdFromUrl
    ) {
      dashboardId.current = dashboardIdFromUrl;
      setSavedDashboardInstance({});
      getSavedDashboardInstance();
    }
  }, [eventEmitter, isChromeVisible, services, savedDashboardInstance, dashboardIdFromUrl]);

  return savedDashboardInstance;
};
