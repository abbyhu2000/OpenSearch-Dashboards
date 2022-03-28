/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import { MiscUtils } from '@opensearch-dashboards-test/opensearch-dashboards-test-library';

const miscUtils = new MiscUtils(cy);

describe('verify the advanced settings are saved', () => {
  beforeEach(() => {
    miscUtils.visitPage('app/management/opensearch-dashboards/settings');
  });

  it('the dark mode is on', () => {
    cy.get('[data-test-subj="advancedSetting-editField-theme:darkMode"]')
      .invoke('attr', 'aria-checked')
      .should('eq', 'true');
  });

  it('the Timeline default columns field is set to 4', () => {
    cy.get('[data-test-subj="advancedSetting-editField-timeline:default_columns"]').should(
      'have.value',
      4
    );
  });

  it('the Timeline Maximum buckets field is set to 4', () => {
    cy.get('[data-test-subj="advancedSetting-editField-timeline:max_buckets"]').should(
      'have.value',
      4
    );
  });
});