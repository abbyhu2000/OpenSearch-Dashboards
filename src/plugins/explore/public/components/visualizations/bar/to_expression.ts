/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import { VEGASCHEMA, VisColumn } from '../types';
import { BarChartStyleControls } from './bar_vis_config';

export const createBarSpec = (
  transformedData: Array<Record<string, any>>,
  numericalColumns: VisColumn[],
  categoricalColumns: VisColumn[],
  dateColumns: VisColumn[],
  styles: Partial<BarChartStyleControls>
): any => {
  // Check if we have the required columns
  if (numericalColumns.length === 0 || categoricalColumns.length === 0) {
    throw new Error('Bar chart requires at least one numerical column and one categorical column');
  }

  const metricField = numericalColumns[0].column;
  const categoryField = categoricalColumns[0].column;
  const metricName = numericalColumns[0].name;
  const categoryName = categoricalColumns[0].name;
  const layers: any[] = [];

  const mainLayer = {
    mark: {
      type: 'bar',
      tooltip: true,
    },
    encoding: {
      x: {
        field: categoryField,
        type: 'nominal',
        axis: {
          title: categoryName,
          labelAngle: -45,
        },
      },
      y: {
        field: metricField,
        type: 'quantitative',
        axis: {
          title: metricName,
        },
      },
    },
  };

  layers.push(mainLayer);

  return {
    $schema: VEGASCHEMA,
    title: `${metricName} by ${categoryName}`,
    data: { values: transformedData },
    layer: layers,
  };
};
