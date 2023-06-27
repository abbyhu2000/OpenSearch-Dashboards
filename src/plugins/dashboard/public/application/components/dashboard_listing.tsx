/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useCallback, useMemo } from 'react';
import { i18n } from '@osd/i18n';
import { useMount } from 'react-use';
import { useLocation } from 'react-router-dom';
import {
  useOpenSearchDashboards,
  TableListView,
} from '../../../../opensearch_dashboards_react/public';
import { CreateButton } from '../listing/create_button';
import { DashboardConstants, createDashboardEditUrl } from '../../dashboard_constants';
import { DashboardServices } from '../../types';
import { getTableColumns } from '../utils/get_table_columns';
import { getNoItemsMessage } from '../utils/get_no_items_message';
import { useEffect } from 'react';

export const EMPTY_FILTER = '';

export const DashboardListing = () => {
  const {
    services: {
      application,
      chrome,
      savedObjectsPublic,
      savedObjectsClient,
      dashboardConfig,
      history,
      uiSettings,
      notifications,
      savedDashboards,
      dashboardProviders,
    },
  } = useOpenSearchDashboards<DashboardServices>();

  const location  = useLocation();
  
  useEffect(() => {

    const getDashboardsBasedOnUrl = async () => {
      const queryParameters = new URLSearchParams(location.search);
      const title = queryParameters.get('title');

    try{
      if(title){
        const results = await savedObjectsClient.find({
            search: `"${title}"`,
            searchFields: ['title'],
            type: 'dashboard',
        })

        console.log("results", results)

        // The search isn't an exact match, lets see if we can find a single exact match to use
        /*const matchingDashboards = results.savedObjects.filter(
          (dashboard) =>
              dashboard.attributes.title.toLowerCase() === title.toLowerCase()
        );
      if (matchingDashboards.length === 1) {
          history.replace(createDashboardEditUrl(matchingDashboards[0].id));
      } else {
          history.replace(`${DashboardConstants.LANDING_PAGE_PATH}?filter="${title}"`);
      }*/
      }
    } catch(e){

    }
    }

    getDashboardsBasedOnUrl()

  }, [])

  const hideWriteControls = dashboardConfig.getHideWriteControls();

  const tableColumns = useMemo(() => getTableColumns(application, history, uiSettings), [
    application,
    history,
    uiSettings,
  ]);

  const createItem = useCallback(() => {
    history.push(DashboardConstants.CREATE_NEW_DASHBOARD_URL);
  }, [history]);

  const noItemsFragment = useMemo(
    () => getNoItemsMessage(hideWriteControls, createItem, application),
    [hideWriteControls, createItem, application]
  );

  const dashboardProvidersForListing = dashboardProviders() || {};

  const dashboardListTypes = Object.keys(dashboardProvidersForListing);
  const initialPageSize = savedObjectsPublic.settings.getPerPage();
  const listingLimit = savedObjectsPublic.settings.getListingLimit();

  const mapListAttributesToDashboardProvider = (obj: any) => {
    const provider = dashboardProvidersForListing[obj.type];
    return {
      id: obj.id,
      appId: provider.appId,
      type: provider.savedObjectsName,
      ...obj.attributes,
      updated_at: obj.updated_at,
      viewUrl: provider.viewUrlPathFn(obj),
      editUrl: provider.editUrlPathFn(obj),
    };
  };

  const find = async (search: any) => {
    const res = await savedObjectsClient.find({
      type: dashboardListTypes,
      search: search ? `${search}*` : undefined,
      fields: ['title', 'type', 'description', 'updated_at'],
      perPage: listingLimit,
      page: 1,
      searchFields: ['title^3', 'type', 'description'],
      defaultSearchOperator: 'AND',
    });
    const list = res.savedObjects?.map(mapListAttributesToDashboardProvider) || [];

    return {
      total: list.length,
      hits: list,
    };
  };

  const editItem = useCallback(
    ({ appId, editUrl }: any) => {
      if (appId === 'dashboard') {
        history.push(editUrl);
      } else {
        application.navigateToUrl(editUrl);
      }
    },
    [history, application]
  );

  // const viewItem = useCallback(
  //   ({ appId, viewUrl }: any) => {
  //     if (appId === 'dashboard') {
  //       history.push(viewUrl);
  //     } else {
  //       application.navigateToUrl(viewUrl);
  //     }
  //   },
  //   [history, application]
  // );

  const deleteItems = useCallback(
    (dashboards: object[]) => {
      return savedDashboards.delete(dashboards.map((d: any) => d.id));
    },
    [savedDashboards]
  );

  useMount(() => {
    chrome.setBreadcrumbs([
      {
        text: i18n.translate('dashboard.dashboardBreadcrumbsTitle', {
          defaultMessage: 'Dashboards',
        }),
      },
    ]);

    chrome.docTitle.change(
      i18n.translate('dashboard.dashboardPageTitle', { defaultMessage: 'Dashboards' })
    );
  });

  return (
    <TableListView
      headingId="dashboardListingHeading"
      createItem={hideWriteControls ? undefined : createItem}
      createButton={
        hideWriteControls ? undefined : <CreateButton dashboardProviders={dashboardProviders()} />
      }
      findItems={find}
      deleteItems={hideWriteControls ? undefined : deleteItems}
      editItem={hideWriteControls ? undefined : editItem}
      tableColumns={tableColumns}
      listingLimit={listingLimit}
      initialFilter={''}
      initialPageSize={initialPageSize}
      noItemsFragment={noItemsFragment}
      entityName={i18n.translate('dashboard.listing.table.entityName', {
        defaultMessage: 'dashboard',
      })}
      entityNamePlural={i18n.translate('dashboard.listing.table.entityNamePlural', {
        defaultMessage: 'dashboards',
      })}
      tableListTitle={i18n.translate('dashboard.listing.dashboardsTitle', {
        defaultMessage: 'Dashboards',
      })}
      toastNotifications={notifications.toasts}
    />
  );
};
