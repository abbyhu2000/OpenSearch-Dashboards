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
      // Y-axis: Categorical field (categories)
      y: {
        field: categoryField,
        type: 'nominal',
        axis: {
          title: categoryName,
        },
      },
      // X-axis: Numerical field (values)
      x: {
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

export const createStackedBarSpec = (
  transformedData: Array<Record<string, any>>,
  numericalColumns: VisColumn[],
  categoricalColumns: VisColumn[],
  styles: Partial<BarChartStyleControls>
): any => {
  // Check if we have the required columns
  if (numericalColumns.length === 0 || categoricalColumns.length < 2) {
    throw new Error(
      'Stacked bar chart requires at least one numerical column and two categorical columns'
    );
  }

  const metricField = numericalColumns[0].column;
  const categoryField1 = categoricalColumns[0].column; // Y-axis (categories)
  const categoryField2 = categoricalColumns[1].column; // Color (stacking)

  const metricName = numericalColumns[0].name;
  const categoryName1 = categoricalColumns[0].name;
  const categoryName2 = categoricalColumns[1].name;

  return {
    $schema: VEGASCHEMA,
    title: `${metricName} by ${categoryName1} and ${categoryName2}`,
    data: { values: transformedData },
    mark: {
      type: 'bar',
      tooltip: true,
    },
    encoding: {
      // Y-axis: First categorical field (categories)
      y: {
        field: categoryField1,
        type: 'nominal',
        axis: {
          title: categoryName1,
        },
      },
      // X-axis: Numerical field (values)
      x: {
        field: metricField,
        type: 'quantitative',
        axis: {
          title: metricName,
        },
        stack: 'normalize', // Can be 'zero', 'normalize', or 'center'
      },
      // Color: Second categorical field (stacking)
      color: {
        field: categoryField2,
        type: 'nominal',
        legend: {
          title: categoryName2,
          orient: 'bottom',
        },
      },
      // Optional: Add tooltip with all information
      tooltip: [
        { field: categoryField1, type: 'nominal', title: categoryName1 },
        { field: categoryField2, type: 'nominal', title: categoryName2 },
        { field: metricField, type: 'quantitative', title: metricName },
      ],
    },
  };
};
