/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  EuiAccordion,
  EuiFlyoutHeader,
  EuiTitle,
  EuiFlyoutBody,
  EuiFlexGroup,
  EuiFlexItem,
  EuiDataGridCellValueElementProps,
  EuiButtonIcon,
} from '@elastic/eui';
import { FormattedMessage } from 'react-intl';
import { DocViewerLinks } from '../doc_viewer_links/doc_viewer_links';
import { DocViewer } from '../doc_viewer/doc_viewer';
import { DocViewFilterFn, OpenSearchSearchHit } from '../../doc_views/doc_views_types';
import { IndexPattern } from '../../../opensearch_dashboards_services';
import { useDataGridContext } from './data_grid_table_context';

export function InlineInspectButton({ rowIndex }: EuiDataGridCellValueElementProps) {
  const {
    inspectedHit,
    rows,
    columns,
    indexPattern,
    onFilter,
    onClose,
    onAddColumn,
    onRemoveColumn,
    setInspectedHit,
  } = useDataGridContext();
  console.log('rowIndex', rowIndex);
  console.log('inspectedHit', inspectedHit);
  const currentInspected = rows[rowIndex];
  const isCurrentInspected = currentInspected === inspectedHit;
  console.log('isCurrentInspected', isCurrentInspected);

  return (
    <EuiAccordion
      id={`inlineExpanding`}
      initialIsOpen={false}
      buttonContent={''}
      buttonClassName="eui-textTruncate"
      onClick={() => setInspectedHit(isCurrentInspected ? undefined : currentInspected)}
    >
      {inspectedHit && (
        // <div>
        //     <EuiTitle>
        //       <h2>
        //         <FormattedMessage
        //           id="discover.docView.flyoutTitle"
        //           defaultMessage="Document Details"
        //         />
        //       </h2>
        //     </EuiTitle>
        //     <EuiFlexGroup direction="column">
        //       <EuiFlexItem>
        //         <DocViewerLinks hit={inspectedHit} indexPattern={indexPattern} columns={columns} />
        //       </EuiFlexItem>
        //       <EuiFlexItem>
        //         <DocViewer
        //           hit={inspectedHit}
        //           columns={columns}
        //           indexPattern={indexPattern}
        //           onRemoveColumn={(columnName: string) => {
        //             onRemoveColumn(columnName);
        //             onClose();
        //           }}
        //           onAddColumn={(columnName: string) => {
        //             onAddColumn(columnName);
        //             onClose();
        //           }}
        //           filter={(mapping, value, mode) => {
        //             onFilter(mapping, value, mode);
        //             onClose();
        //           }}
        //         />
        //       </EuiFlexItem>
        //     </EuiFlexGroup>
        // </div>
        <tr>
          <td colSpan={3}>
            <div>
              <EuiTitle>
                <h2>
                  <FormattedMessage
                    id="discover.docView.flyoutTitle"
                    defaultMessage="Document Details"
                  />
                </h2>
              </EuiTitle>
            </div>
          </td>
        </tr>
      )}
      //
    </EuiAccordion>
  );
}
