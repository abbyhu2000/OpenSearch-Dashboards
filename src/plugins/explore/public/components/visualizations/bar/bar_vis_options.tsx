/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { i18n } from '@osd/i18n';
import { EuiTabbedContent, EuiTabbedContentTab } from '@elastic/eui';
import { GeneralVisOptions } from '../style_panel/general_vis_options';
import { BarChartStyleControls } from './bar_vis_config';
import { VisColumn } from '../types';

export interface BarVisStyleControlsProps {
  styleOptions: BarChartStyleControls;
  onStyleChange: (newOptions: Partial<BarChartStyleControls>) => void;
  numericalColumns?: VisColumn[];
  categoricalColumns?: VisColumn[];
  dateColumns?: VisColumn[];
}

export const BarVisStyleControls: React.FC<BarVisStyleControlsProps> = ({
  styleOptions,
  onStyleChange,
  numericalColumns = [],
  categoricalColumns = [],
  dateColumns = [],
}) => {
  const updateStyleOption = <K extends keyof BarChartStyleControls>(
    key: K,
    value: BarChartStyleControls[K]
  ) => {
    onStyleChange({ [key]: value });
  };

  const tabs: EuiTabbedContentTab[] = [
    {
      id: 'basic',
      name: i18n.translate('explore.vis.barChart.tabs.general', {
        defaultMessage: 'Basic',
      }),
      content: (
        <GeneralVisOptions
          addTooltip={styleOptions.addTooltip}
          addLegend={styleOptions.addLegend}
          legendPosition={styleOptions.legendPosition}
          onAddTooltipChange={(addTooltip) => updateStyleOption('addTooltip', addTooltip)}
          onAddLegendChange={(addLegend) => updateStyleOption('addLegend', addLegend)}
          onLegendPositionChange={(legendPosition) =>
            updateStyleOption('legendPosition', legendPosition)
          }
        />
      ),
    },
  ];

  return (
    <EuiTabbedContent
      tabs={tabs}
      initialSelectedTab={tabs[0]}
      autoFocus="selected"
      size="s"
      expand={false}
    />
  );
};
