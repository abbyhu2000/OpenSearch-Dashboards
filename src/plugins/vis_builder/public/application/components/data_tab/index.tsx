/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { FieldSelector } from './field_selector';

import './index.scss';
import { ConfigPanel } from './config_panel';
// import { EventEmitter } from 'stream';
import { DataTabProps, EventEmitterProp } from '../../../types';

export const DATA_TAB_ID = 'data_tab';

export const DataTab = ({appState}: DataTabProps) => {
  return (
    <div className="vbDataTab">
      <FieldSelector />
      <ConfigPanel appState={appState}/>
    </div>
  );
};
