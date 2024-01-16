/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { i18n } from '@osd/i18n';
import { EuiToolTip, EuiButtonIcon, EuiDataGridCellValueElementProps } from '@elastic/eui';
import { useDataGridContext } from './data_grid_table_context';

export const DocViewInspectButton = ({ rowIndex }: EuiDataGridCellValueElementProps) => {
  const { inspectedHit, setInspectedHit, rows } = useDataGridContext();
  console.log('rowIndex', rowIndex);
  console.log('inspectedHit', inspectedHit);
  const currentInspected = rows[rowIndex];
  const isCurrentInspected = currentInspected === inspectedHit;
  console.log('isCurrentInspected', isCurrentInspected);
  const inspectHintMsg = i18n.translate('discover.docViews.table.inspectAriaLabel', {
    defaultMessage: 'Inspect document details',
  });

  return (
    <EuiToolTip content={inspectHintMsg}>
      <EuiButtonIcon
        onClick={() => setInspectedHit(isCurrentInspected ? undefined : currentInspected)}
        iconType={isCurrentInspected ? 'minimize' : 'inspect'}
        aria-label={inspectHintMsg}
        data-test-subj={`docTableExpandToggleColumn-${rowIndex}`}
      />
    </EuiToolTip>
  );
};
