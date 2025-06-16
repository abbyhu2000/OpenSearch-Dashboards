/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { VisualizationType } from '../utils/use_visualization_types';

import { Positions } from '../types';
import { BarVisStyleControls, BarVisStyleControlsProps } from './bar_vis_options';

export interface BarChartStyleControls {
  // Basic controls
  addTooltip: boolean;
  addLegend: boolean;
  legendPosition: Positions;
}

export const defaultBarChartStyles: BarChartStyleControls = {
  // Basic controls
  addTooltip: true,
  addLegend: true,
  legendPosition: Positions.RIGHT,
};

export const createBarConfig = (): VisualizationType => ({
  name: 'bar',
  type: 'bar',
  ui: {
    style: {
      defaults: defaultBarChartStyles,
      render: (props) =>
        React.createElement(BarVisStyleControls, props as BarVisStyleControlsProps),
    },
  },
});
