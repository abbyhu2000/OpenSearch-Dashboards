/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo, useCallback, Fragment } from 'react';
import { EuiDataGrid, EuiDataGridSorting, EuiPanel, EuiBasicTable, EuiDescriptionList, EuiDescriptionListTitle, EuiDescriptionListDescription } from '@elastic/eui';
import { IndexPattern } from '../../../opensearch_dashboards_services';
import { fetchSourceTypeDataCell, fetchTableDataCell } from './data_grid_table_cell_value';
import { buildDataGridColumns, computeVisibleColumns } from './data_grid_table_columns';
import { DocViewInspectButton } from './data_grid_table_docview_inspect_button';
import { DataGridFlyout } from './data_grid_table_flyout';
import { DiscoverGridContextProvider } from './data_grid_table_context';
import { toolbarVisibility } from './constants';
import { DocViewFilterFn, OpenSearchSearchHit } from '../../doc_views/doc_views_types';
import { usePagination } from '../utils/use_pagination';
import { SortOrder } from '../../../saved_searches/types';
import { buildColumns } from '../../utils/columns';
import dompurify from 'dompurify';

export interface DataGridTableProps {
  columns: string[];
  indexPattern: IndexPattern;
  onAddColumn: (column: string) => void;
  onFilter: DocViewFilterFn;
  onRemoveColumn: (column: string) => void;
  onSort: (sort: SortOrder[]) => void;
  rows: OpenSearchSearchHit[];
  onSetColumns: (columns: string[]) => void;
  sort: SortOrder[];
  displayTimeColumn: boolean;
  title?: string;
  description?: string;
  isToolbarVisible?: boolean;
  isContextView?: boolean;
  isLoading?: boolean;
}

export const DataGridTable = ({
  columns,
  indexPattern,
  onAddColumn,
  onFilter,
  onRemoveColumn,
  onSetColumns,
  onSort,
  sort,
  rows,
  displayTimeColumn,
  title = '',
  description = '',
  isToolbarVisible = true,
  isContextView = false,
  isLoading = false,
}: DataGridTableProps) => {
  console.log('rows', rows);
  console.log('column', columns);
  const [inspectedHit, setInspectedHit] = useState<OpenSearchSearchHit | undefined>();
  const rowCount = useMemo(() => (rows ? rows.length : 0), [rows]);
  const pagination = usePagination(rowCount);

  let adjustedColumns = buildColumns(columns);
  // handle case where the user removes selected filed and leaves only time column
  if (
    adjustedColumns.length === 1 &&
    indexPattern &&
    adjustedColumns[0] === indexPattern.timeFieldName
  ) {
    adjustedColumns = [...adjustedColumns, '_source'];
  }

  const includeSourceInColumns = adjustedColumns.includes('_source');
  const sortingColumns = useMemo(() => sort.map(([id, direction]) => ({ id, direction })), [sort]);
  const rowHeightsOptions = useMemo(
    () => ({
      defaultHeight: {
        lineCount: adjustedColumns.includes('_source') ? 3 : 1,
      },
    }),
    [adjustedColumns]
  );

  const onColumnSort = useCallback(
    (cols: EuiDataGridSorting['columns']) => {
      onSort(cols.map(({ id, direction }) => [id, direction]));
    },
    [onSort]
  );

  const renderCellValue = useMemo(() => fetchTableDataCell(indexPattern, rows), [
    indexPattern,
    rows,
  ]);

  const dataGridTableColumns = useMemo(
    () =>
      buildDataGridColumns(
        adjustedColumns,
        indexPattern,
        displayTimeColumn,
        includeSourceInColumns,
        isContextView
      ),
    [adjustedColumns, indexPattern, displayTimeColumn, includeSourceInColumns, isContextView]
  );

  console.log('dataGridTableColumns', dataGridTableColumns);

  const dataGridTableColumnsVisibility = useMemo(
    () => ({
      visibleColumns: computeVisibleColumns(
        adjustedColumns,
        indexPattern,
        displayTimeColumn
      ) as string[],
      setVisibleColumns: (cols: string[]) => {
        onSetColumns(cols);
      },
    }),
    [adjustedColumns, indexPattern, displayTimeColumn, onSetColumns]
  );

  const sorting: EuiDataGridSorting = useMemo(
    () => ({ columns: sortingColumns, onSort: onColumnSort }),
    [sortingColumns, onColumnSort]
  );

  const leadingControlColumns = useMemo(() => {
    return [
      {
        id: 'inspectCollapseColumn',
        headerCellRender: () => null,
        rowCellRender: DocViewInspectButton,
        width: 40,
      },
    ];
  }, []);

  const table = useMemo(
    () => (
      <EuiDataGrid
        aria-labelledby="aria-labelledby"
        columns={dataGridTableColumns}
        columnVisibility={dataGridTableColumnsVisibility}
        leadingControlColumns={leadingControlColumns}
        data-test-subj="docTable"
        pagination={pagination}
        renderCellValue={renderCellValue}
        rowCount={rowCount}
        sorting={sorting}
        toolbarVisibility={isToolbarVisible ? toolbarVisibility : false}
        rowHeightsOptions={rowHeightsOptions}
      />
    ),
    [
      dataGridTableColumns,
      dataGridTableColumnsVisibility,
      leadingControlColumns,
      pagination,
      renderCellValue,
      rowCount,
      sorting,
      isToolbarVisible,
      rowHeightsOptions,
    ]
  );

  const basicTableColumns = dataGridTableColumns.map((column) => {
    console.log("here1", column)
    return {
      field: column.id === '_source' ? '_source' : `_source.${column.id}`,
      name: column.display,
      render: (item) => {
        console.log("here2", item)
        
        return column.id === '_source' ? (
        <EuiDescriptionList type="inline" compressed>
        {Object.keys(item).map((key) => (
          <Fragment key={key}>
            <EuiDescriptionListTitle className="osdDescriptionListFieldTitle">
              {key}
            </EuiDescriptionListTitle>
            <EuiDescriptionListDescription
              dangerouslySetInnerHTML={{ __html: dompurify.sanitize(item[key]) }}
            />
          </Fragment>
        ))}
      </EuiDescriptionList>)
      : item
      }
    };
  });

  const basicTable = useMemo(() => <EuiBasicTable items={rows} columns={basicTableColumns} />, [
    rows,
    basicTableColumns,
  ]);

  return (
    <DiscoverGridContextProvider
      value={{
        inspectedHit,
        onFilter,
        setInspectedHit,
        rows: rows || [],
        indexPattern,
      }}
    >
      <div
        data-render-complete={!isLoading}
        data-shared-item=""
        data-title={title}
        data-description={description}
        data-test-subj="discoverTable"
      >
        <EuiPanel hasBorder={false} hasShadow={false} paddingSize="s" color="transparent">
          <EuiPanel paddingSize="s" style={{ height: '100%' }}>
            {basicTable}
          </EuiPanel>
        </EuiPanel>
        {inspectedHit && (
          <DataGridFlyout
            indexPattern={indexPattern}
            hit={inspectedHit}
            columns={adjustedColumns}
            onRemoveColumn={onRemoveColumn}
            onAddColumn={onAddColumn}
            onFilter={onFilter}
            onClose={() => setInspectedHit(undefined)}
          />
        )}
      </div>
    </DiscoverGridContextProvider>
  );
};
