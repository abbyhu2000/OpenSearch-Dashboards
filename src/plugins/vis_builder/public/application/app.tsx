/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from 'react';
import { I18nProvider } from '@osd/i18n/react';
import { EuiPage, EuiResizableContainer } from '@elastic/eui';
import { useLocation } from 'react-router-dom';
import { DragDropProvider } from './utils/drag_drop/drag_drop_context';
import { LeftNav } from './components/left_nav';
import { TopNav } from './components/top_nav';
import { Workspace } from './components/workspace';
import './app.scss';
import { RightNav } from './components/right_nav';
import { useOpenSearchDashboards } from '../../../opensearch_dashboards_react/public';
import { VisBuilderServices } from '../types';
import { syncQueryStateWithUrl } from '../../../data/public';
import EventEmitter from 'events';
import { useVisBuilderAppState } from './utils/use/use_vis_builder_app_state';

export const VisBuilderApp = () => {
  const {
    services: {
      data: { query },
      osdUrlStateStorage,
    },
  } = useOpenSearchDashboards<VisBuilderServices>();
  const { pathname } = useLocation();
  const [eventEmitter] = useState(new EventEmitter());

  useEffect(() => {
    // syncs `_g` portion of url with query services
    const { stop } = syncQueryStateWithUrl(query, osdUrlStateStorage);

    return () => stop();

    // this effect should re-run when pathname is changed to preserve querystring part,
    // so the global state is always preserved
  }, [query, osdUrlStateStorage, pathname]);

  //const { instace } = useVisBuilderAppState
  // Render the application DOM.
  return (
    <I18nProvider>
      <DragDropProvider>
        <EuiPage className="vbLayout">
          <TopNav eventEmitter={eventEmitter}/>
          <LeftNav eventEmitter={eventEmitter}/>
          <EuiResizableContainer className="vbLayout__resizeContainer">
            {(EuiResizablePanel, EuiResizableButton) => (
              <>
                <EuiResizablePanel
                  className="vbLayout__workspaceResize"
                  paddingSize="none"
                  initialSize={80}
                  minSize="300px"
                  mode="main"
                >
                  <Workspace />
                </EuiResizablePanel>
                <EuiResizableButton className="vbLayout__resizeButton" />
                <EuiResizablePanel
                  className="vbLayout__rightNavResize"
                  paddingSize="none"
                  initialSize={20}
                  minSize="250px"
                  mode={[
                    'collapsible',
                    {
                      position: 'top',
                    },
                  ]}
                  id="vbRightResize"
                >
                  <RightNav />
                </EuiResizablePanel>
              </>
            )}
          </EuiResizableContainer>
        </EuiPage>
      </DragDropProvider>
    </I18nProvider>
  );
};

export { Option } from './components/option';
