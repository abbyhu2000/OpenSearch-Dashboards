/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { DataSourceSelect } from './data_source_select';
import { DataTab } from './data_tab';

export const LeftNav = () => {
  return (
    <section>
      <div>
        <DataSourceSelect />
      </div>
      <DataTab key="containerName" />
    </section>
  );
};
