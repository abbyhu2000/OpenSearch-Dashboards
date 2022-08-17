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

    const formControl = (
        <EuiFormControlLayout
          fullWidth={true}
          style={{ cursor: 'pointer' }}
          icon={{ type: 'arrowDown', side: 'right' }}
          readOnly={true}
        >
            <EuiButton>
            iconType={activeVisualization?.icon} 
            onClick={onButtonClick}
            color="text"
            size="s"
            style={{ textAlign: 'left' }}
                {activeVisualization?.title}
                </EuiButton>
        </EuiFormControlLayout>
      );
  
    return (
      <EuiPopover
        id="contextMenuExample"
        button={formControl}
        isOpen={isPopoverOpen}
        closePopover={closePopover}
        panelPaddingSize="none"
        anchorPosition="downLeft"
      >
     <div className="wizVizTypeSelect">
     <EuiText>Chart Type</EuiText>
      <EuiFlexGroup responsive={false} gutterSize={'s'}>
        <EuiFlexItem>
          <EuiFieldSearch
            data-test-subj="fieldFilterSearchInput"
            compressed
            fullWidth
            onChange={(event) => dispatch(setSearchField(event.currentTarget.value))}
            placeholder='search'
          />
        </EuiFlexItem>
      </EuiFlexGroup>
      </div>
        <EuiContextMenu initialPanelId={0} panels={panels} />
      </EuiPopover>
    );
  };
  