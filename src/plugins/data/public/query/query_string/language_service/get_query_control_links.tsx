/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { EuiFlexItem } from '@elastic/eui';

export const QueryControls = (props: { queryControls: React.ReactElement[] }) => {
  return (
    <>
      {props.queryControls.map((queryControl) => (
        <EuiFlexItem grow={false}>{queryControl}</EuiFlexItem>
      ))}
    </>
  );
};
