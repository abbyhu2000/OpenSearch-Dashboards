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

/*
 * Licensed to Elasticsearch B.V. under one or more contributor
 * license agreements. See the NOTICE file distributed with
 * this work for additional information regarding copyright
 * ownership. Elasticsearch B.V. licenses this file to you under
 * the Apache License, Version 2.0 (the "License"); you may
 * not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

import React, { useEffect, useState } from 'react';
import { cloneDeep, has, isEqual } from 'lodash';
import { map } from 'rxjs/operators';
import { EventEmitter } from 'events';

import { opensearchFilters, connectToQueryState, Query } from '../../../../../data/public';
import {
    VisBuilderServices,
    VisBuilderAppStateContainer,
} from '../../../types';
import { visBuilderEditorState } from '../get_vis_builder_editor_state';
import { createVisBuilderAppState } from '../create_vis_builder_app_state';
import { SavedObject } from '../../../../../saved_objects/public';
import { setStyleState, setVisualizationState, useTypedDispatch, useTypedSelector, VisualizationState } from '../state_management';
import { appendAppPath } from '../../../../../../core/public/application/utils';
import { CombinedState } from 'redux';
import { MetadataState } from '../state_management/metadata_slice';
//import { migrateLegacyQuery } from '../../../../../discover/public/application/helpers/migrate_legacy_query';


//import { migrateLegacyQuery } from '../../../../../data/common/search/search_source/migrate_legacy_query';

/**
 * This effect is responsible for instantiating the visualize app state container,
 * which is in sync with "_a" url param
 */
export const useVisBuilderAppState = (
  services: VisBuilderServices,
  eventEmitter: EventEmitter,
  instance?: SavedObject,
  rootState?: CombinedState<{
    style: any;
    visualization: VisualizationState;
    metadata: MetadataState;
}>
) => {
  //const [hasUnappliedChanges, setHasUnappliedChanges] = useState(false);
  const [appState, setAppState] = useState<VisBuilderAppStateContainer | null>(null);
  const visualizationState = useTypedSelector(state => state.visualization)
  //const [visualizationState, setVisualizationState] = useState()
  //const styleState = useTypedSelector((state)=>state.style)
  const dispatch = useTypedDispatch();
  /*useEffect(() => {

  }, visualizationState)*/
  
  useEffect(() => {
    if (instance && rootState) {
      const stateDefaults = visBuilderEditorState(instance, services, rootState);
      
      /*const stateDefaults = {
        ...states,
        visualizationState: visualizationState,
        styleState: styleState
      }*/
      const { stateContainer, stopStateSync } = createVisBuilderAppState({
        stateDefaults,
        osdUrlStateStorage: services.osdUrlStateStorage,
      });

      const onDirtyStateChange = ({ isDirty }: { isDirty: boolean }) => {
        if (!isDirty) {
          const currentStates = visBuilderEditorState(instance, services, rootState)
          // it is important to update vis state with fresh data
          console.log("instance", instance)
          console.log("root state", rootState)

          
          console.log("visualizationstate", visualizationState)
          console.log("before", stateContainer.getState().visualizationState)
          stateContainer.transitions.updateVisState(visBuilderEditorState(instance, services, rootState).visualizationState);
          console.log("after", stateContainer.getState().visualizationState)
          stateContainer.transitions.updateStyleState(visBuilderEditorState(instance, services, rootState).styleState);
        }
        //setHasUnappliedChanges(isDirty);
      };

      eventEmitter.on('dirtyStateChange', onDirtyStateChange);

const migrateLegacyQuery = (query: Query | { [key: string]: any } | string): Query => {
  // Lucene was the only option before, so language-less queries are all lucene
  if (!has(query, 'language')) {
    return { query, language: 'lucene' };
  }

  return query as Query;
}
      const { filterManager, queryString } = services.data.query;
      // sync initial app state from state to managers
      filterManager.setAppFilters(cloneDeep(stateContainer.getState().filters));
      queryString.setQuery(migrateLegacyQuery(stateContainer.getState().query));

      // setup syncing of app filters between appState and query services
      const stopSyncingAppFilters = connectToQueryState(
        services.data.query,
        {
          set: ({ filters, query }) => {
            stateContainer.transitions.set('filters', filters);
            stateContainer.transitions.set('query', query);
          },
          get: () => {
            return {
              filters: stateContainer.getState().filters,
              query: stateContainer.getState().query,
            };
          },
          state$: stateContainer.state$.pipe(
            map((state) => ({
              filters: state.filters,
              query: state.query,
            }))
          ),
        },
        {
          filters: opensearchFilters.FilterStateStore.APP_STATE,
          query: true,
        }
      );

      // The savedVis is pulled from OpenSearch, but the appState is pulled from the url, with the
      // defaults applied. If the url was from a previous session which included modifications to the
      // appState then they won't be equal.
      
      if (!isEqual(stateContainer.getState().visualizationState, stateDefaults.visualizationState)) {
        const visualizationState = stateContainer.getState().visualizationState;
        //dispatch(setVisualizationState(visualizationState))
      } 

      if(!isEqual(stateContainer.getState().styleState, stateDefaults.styleState)){
        const styleState = stateContainer.getState().styleState;
        //dispatch(setStyleState(styleState))
      }
      
      setAppState(stateContainer);
      

      // don't forget to clean up
      return () => {
        eventEmitter.off('dirtyStateChange', onDirtyStateChange);
        stopStateSync();
        stopSyncingAppFilters();
      };
    }
  }, [eventEmitter, instance, services, visualizationState ]);

  return appState;
};