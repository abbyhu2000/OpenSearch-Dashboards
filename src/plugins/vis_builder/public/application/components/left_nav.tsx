/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import './side_nav.scss';
import { DataSourceSelect } from './data_source_select';
import { DataTab } from './data_tab';
import { EventEmitterProp, LeftNavProps, VisBuilderServices } from '../../types';
import { useOpenSearchDashboards } from '../../../../opensearch_dashboards_react/public';
import { useTypedSelector, useTypedDispatch } from '../utils/state_management';
import { useSavedVisBuilderVis } from '../utils/use';
import { useCanSave } from '../utils/use/use_can_save';
import { useVisBuilderAppState } from '../utils/use/use_vis_builder_app_state';

export const LeftNav = ({eventEmitter}: EventEmitterProp) => {
  const { services } = useOpenSearchDashboards<VisBuilderServices>();
  const rootState = useTypedSelector((state) => state);
  const dispatch = useTypedDispatch();

  const savedVisBuilderVis = useSavedVisBuilderVis(eventEmitter, visualizationIdFromUrl);
  console.log("save vis builder vis", savedVisBuilderVis)
  const appState = useVisBuilderAppState(
    services,
    eventEmitter,
    savedVisBuilderVis,
    rootState
  )
  
  return (
    <section className="vbSidenav left">
      <div className="vbDatasourceSelect vbSidenav__header">
        <DataSourceSelect appState={appState!}/>
      </div>
      <DataTab key="containerName" appState={appState!}/>
    </section>
  );
};
