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

import './_table_header.scss';

import React from 'react';
import { EuiDataGridColumn, EuiDataGridSorting } from '@elastic/eui';
import { IndexPattern } from '../../../opensearch_dashboards_services';
import { TableHeaderColumn } from './table_header_column';

interface Props {
  displayedTableColumns: EuiDataGridColumn[];
  // columns: string[];
  defaultSortOrder: string;
  // hideTimeColumn: boolean;
  indexPattern: IndexPattern;
  // isShortDots: boolean;
  onChangeSortOrder?: (cols: EuiDataGridSorting['columns']) => void;
  onMoveColumn?: (name: string, index: number) => void;
  onRemoveColumn?: (name: string) => void;
  onReorderColumn?: (col: string, source: number, destination: number) => void;
  sortOrder: Array<{
    id: string;
    direction: 'desc' | 'asc';
  }>;
}

export function TableHeader({
  displayedTableColumns,
  defaultSortOrder,
  // hideTimeColumn,
  indexPattern,
  // isShortDots,
  onChangeSortOrder,
  onReorderColumn,
  onRemoveColumn,
  sortOrder,
}: Props) {
  const timeColName = indexPattern.timeFieldName;
  return (
    <tr data-test-subj="docTableHeader" className="osdDocTableHeader">
      <th style={{ width: '24px' }} />
      {displayedTableColumns.map(
        (col: EuiDataGridColumn, idx: number, cols: EuiDataGridColumn[]) => {
          const colLeftIdx =
            !col.actions || !col.actions!.showMoveLeft || idx - 1 <= 0 || col.id === timeColName
              ? -1
              : idx - 1;
          const colRightIdx =
            !col.actions ||
            !col.actions!.showMoveRight ||
            idx + 1 >= cols.length ||
            col.id === timeColName
              ? -1
              : idx + 1;

          return (
            <TableHeaderColumn
              currentIdx={idx}
              colLeftIdx={colLeftIdx}
              colRightIdx={colRightIdx}
              displayName={col.display}
              isRemoveable={col.actions && col.actions.showHide ? true : false}
              isSortable={col.isSortable}
              name={col.display as string}
              sortOrder={
                sortOrder.length ? sortOrder : []
                // getDefaultSort(indexPattern, defaultSortOrder).map(([id, direction]) => ({ id, direction }))
              }
              onReorderColumn={onReorderColumn}
              onRemoveColumn={onRemoveColumn}
              onChangeSortOrder={onChangeSortOrder}
            />
          );
        }
      )}
    </tr>
  );
}
