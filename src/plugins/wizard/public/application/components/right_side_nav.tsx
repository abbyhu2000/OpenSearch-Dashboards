/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo }  from 'react';
import {
    EuiButton,
    EuiContextMenu,
    EuiContextMenuPanelItemDescriptor,
    EuiFlexItem,
    EuiIcon,
    EuiPopover,
    EuiFlexGroup,
    EuiFieldSearch,
    EuiTitle,
    EuiText,
    EuiFormControlLayout,
    EuiButtonEmpty
  } from '@elastic/eui';
import './right_side_nav.scss';
import './searchable_dropdown.scss';
import { useOpenSearchDashboards } from '../../../../opensearch_dashboards_react/public';
import { WizardServices } from '../../types';
import { useTypedDispatch  } from '../utils/state_management';
import { useVisualizationType } from '../utils/use';
import { setSearchField } from '../utils/state_management/visualization_slice';
  
export const RightSideNav = () => {
  const {
    ui: { containerConfig },
  } = useVisualizationType();

  console.log(useVisualizationType())
  return (
    <section className="wizRightSidenav">
        <div className="wizVizTypeSelect">
            <TypeSelectorPopover />
        </div>
      {containerConfig.style.render()}
    </section>
  );
};

const TypeSelectorPopover = () => {
    const [isPopoverOpen, setPopover] = useState(false);
    const {
      services: { types },
    } = useOpenSearchDashboards<WizardServices>();
    const dispatch = useTypedDispatch();
    const visualizationTypes = types.all();
    const activeVisualization = useVisualizationType();
  
    const onButtonClick = () => {
      setPopover(!isPopoverOpen);
    };
  
    const closePopover = () => {
      setPopover(false);
    };
  
    const panels = useMemo(
      () => [
        {
          id: 0,
          items: visualizationTypes.map(
            ({ name, title, icon, description }): EuiContextMenuPanelItemDescriptor => ({
              name: title,
              icon: <EuiIcon type={icon} />,
              onClick: () => {
                closePopover();
                // TODO: Fix changing viz type
                // dispatch(setActiveVisualization(name));
              },
              toolTipContent: description,
              toolTipPosition: 'right',
            })
          ),
        },
      ],
      [visualizationTypes]
    );
  
    /*const button = (
      <EuiButton iconType={activeVisualization?.icon} onClick={onButtonClick}>
        {activeVisualization?.title}
      </EuiButton>
    );*/

    const button = (
        <EuiButtonEmpty iconType="arrowDown" onClick={onButtonClick}
        color="text"
      size="s"
      style={{ textAlign: 'left' }}>
        {activeVisualization?.title}
      </EuiButtonEmpty>
    )

    console.log(activeVisualization?.icon)

    const formControl = (
        <EuiFormControlLayout
          style={{ cursor: 'pointer' }}
          icon={{ type: 'arrowDown', side: 'right' }}
          readOnly={true}
          fullWidth={true}
        >
            <EuiButtonEmpty
              iconType={activeVisualization?.icon} 
              onClick={onButtonClick}
              color="text"
              size="s"
              style={{ textAlign: 'left' }}
              className="searchableDropdown--topDisplay">
                {activeVisualization?.title}
            </EuiButtonEmpty>
        </EuiFormControlLayout>
      );
  
    return (
      <div className="searchableDropdown">
      <EuiPopover
        button={formControl}
        isOpen={isPopoverOpen}
        closePopover={closePopover}
      >
     <div className="searchableDropdown--fixedWidthChild">
    
        <EuiContextMenu initialPanelId={0} panels={panels} />
        </div>
      </EuiPopover>
      </div>
    );
  };
  