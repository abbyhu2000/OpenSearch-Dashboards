/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import './side_nav.scss';
import { DataSourceSelect } from './data_source_select';
import { DataTab } from './data_tab';
import { EventEmitterProp } from '../../types';

export const LeftNav = ({eventEmitter}: EventEmitterProp) => {
  return (
    <section className="vbSidenav left">
      <div className="vbDatasourceSelect vbSidenav__header">
        <DataSourceSelect eventEmitter={eventEmitter}/>
      </div>
      <DataTab key="containerName" eventEmitter={eventEmitter}/>
    </section>
  );
};
