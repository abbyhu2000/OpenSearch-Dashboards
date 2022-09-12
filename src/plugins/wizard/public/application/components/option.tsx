/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import { EuiAccordion, EuiHorizontalRule, EuiPanel, EuiSpacer } from '@elastic/eui';
import React, { FC } from 'react';

interface Props {
  title: string;
  initialIsOpen?: boolean;
}

export const Option: FC<Props> = ({ title, children, initialIsOpen = false }) => {
  return (
    <>
      <EuiAccordion
        id={title}
        buttonContent={title}
        initialIsOpen={initialIsOpen}
      >
        <EuiSpacer size="s" />
        <EuiPanel color="subdued">
          {children}
        </EuiPanel>
      </EuiAccordion>
      <EuiHorizontalRule margin="none" />
    </>
  );
};
