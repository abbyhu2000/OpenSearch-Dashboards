/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { Fragment } from 'react';
import { EuiSwitch } from '@elastic/eui';

export function showInlineExpandToggle(showInline: boolean, setShowInline: (e: any) => void) {
  const onChange = (change: any) => {
    setShowInline(change.target.checked);
  };
  return (
    <Fragment>
      <EuiSwitch
        className="euiDataGrid__controlBtn"
        checked={showInline ?? false}
        onChange={(e) => onChange(e)}
        label={'View details inline'}
        data-test-subj="inlineInspectToggle"
      />
    </Fragment>
  );
}
