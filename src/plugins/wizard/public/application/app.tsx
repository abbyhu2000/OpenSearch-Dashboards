/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { I18nProvider } from '@osd/i18n/react';
import { EuiPage, EuiResizableContainer, EuiPanel, EuiTitle } from '@elastic/eui';
import { DragDropProvider } from './utils/drag_drop/drag_drop_context';
import { SideNav } from './components/side_nav';
import { RightSideNav } from './components/right_side_nav';
import { TopNav } from './components/top_nav';
import { Workspace } from './components/workspace';
import './app.scss';

export const WizardApp = () => {
  // Render the application DOM.
  return (
    <I18nProvider>
      <DragDropProvider>
        <EuiPage className="wizLayout" paddingSize="none">
          <TopNav />
          
          <EuiResizableContainer>
            {(EuiResizablePanel, EuiResizableButton) => (
              <>
                <EuiResizablePanel
                  mode=
                  "collapsible"
                  initialSize={30}
                  minSize="10%"
                >
                  
                  <SideNav />
                </EuiResizablePanel>

                <EuiResizableButton />

                <EuiResizablePanel mode="main" initialSize={40} minSize="40%">
                  <EuiPanel paddingSize="l" style={{ minHeight: '100%' }}>
                    <Workspace />
                  </EuiPanel>
                </EuiResizablePanel>

                <EuiResizableButton />

                <EuiResizablePanel
                  mode="collapsible"
                  initialSize={30}
                  minSize="10%"
                >
                  <RightSideNav />
                </EuiResizablePanel>
              </>
            )}
          </EuiResizableContainer>


          

        </EuiPage>
      </DragDropProvider>
    </I18nProvider>
  );
};
