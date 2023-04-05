/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { Fragment } from 'react';
import { FormattedMessage } from '@osd/i18n/react';
import { EuiBetaBadge, EuiButton, EuiEmptyPrompt, EuiIcon, EuiLink, EuiBadge } from '@elastic/eui';

export const getNoItemsMessage = (
  hideWriteControls: boolean,
  createItem: () => void,
  application: ApplicationStart
) => {
  if (hideWriteControls) {
    return (
      <div>
        <EuiEmptyPrompt
          iconType="visualizeApp"
          title={
            <h1 id="dashboardListingHeading">
              <FormattedMessage
                id="dashboard.listing.noItemsMessage"
                defaultMessage="Looks like you don't have any dashboards."
              />
            </h1>
          }
        />
      </div>
    );
  }

  return (
    <div>
      <EuiEmptyPrompt
        iconType="dashboardApp"
        title={
          <h1 id="dashboardListingHeading">
            <FormattedMessage
              id="dashboard.listing.createNewDashboard.title"
              defaultMessage="Create your first dashboard"
            />
          </h1>
        }
        body={
          <Fragment>
            <p>
              <FormattedMessage
                id="dashboard.listing.createNewDashboard.combineDataViewFromOpenSearchDashboardsAppDescription"
                defaultMessage="You can combine data views from any OpenSearch Dashboards app into one dashboard and see everything in one place."
              />
            </p>
            <p>
              <FormattedMessage
                id="dashboard.listing.createNewDashboard.newToOpenSearchDashboardsDescription"
                defaultMessage="New to OpenSearch Dashboards? {sampleDataInstallLink} to take a test drive."
                values={{
                  sampleDataInstallLink: (
                    <EuiLink
                      onClick={() =>
                        application.navigateToApp('home', {
                          path: '#/tutorial_directory/sampleData',
                        })
                      }
                    >
                      <FormattedMessage
                        id="dashboard.listing.createNewDashboard.sampleDataInstallLinkText"
                        defaultMessage="Install some sample data"
                      />
                    </EuiLink>
                  ),
                }}
              />
            </p>
          </Fragment>
        }
        actions={
          <EuiButton
            onClick={createItem}
            fill
            iconType="plusInCircle"
            data-test-subj="createDashboardPromptButton"
          >
            <FormattedMessage
              id="dashboard.listing.createNewDashboard.createButtonLabel"
              defaultMessage="Create new dashboard"
            />
          </EuiButton>
        }
      />
    </div>
  );
};
