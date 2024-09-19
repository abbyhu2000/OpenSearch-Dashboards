/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import { i18n } from '@osd/i18n';

import './_recent_query.scss';
import { EuiButtonEmpty, EuiPopover, EuiText, EuiPopoverTitle } from '@elastic/eui';

import React, { useEffect, useState } from 'react';

export enum ResultStatus {
  UNINITIALIZED = 'uninitialized',
  LOADING = 'loading', // initial data load
  READY = 'ready', // results came back
  NO_RESULTS = 'none', // no results came back
  ERROR = 'error', // error occurred
}

export interface QueryStatus {
  status: ResultStatus;
  body?: {
    error?: {
      reason?: string;
      details: string;
    };
    statusCode?: number;
  };
  elapsedMs?: number;
  startTime?: number;
}

// This is the time in milliseconds that the query will wait before showing the loading spinner
const BUFFER_TIME = 3000;

export function QueryResult(props: { queryStatus: QueryStatus }) {
  const [isPopoverOpen, setPopover] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);
  const onButtonClick = () => {
    setPopover(!isPopoverOpen);
  };

  const getTime = () => {
    const time = new Date().getTime() - props.queryStatus.startTime!;
    if (time > BUFFER_TIME) {
      setElapsedTime(time);
    } else {
      setElapsedTime(0);
    }
  };

  useEffect(() => {
    const interval = setInterval(getTime, 1000);

    return () => clearInterval(interval);
  });

  if (props.queryStatus.status === ResultStatus.LOADING) {
    if (elapsedTime < BUFFER_TIME) {
      return null;
    }
    const time = Math.floor(elapsedTime / 1000);
    return (
      <EuiButtonEmpty
        color="text"
        size="xs"
        onClick={() => {}}
        isLoading
        data-test-subj="queryResultLoading"
      >
        {`Loading ${time} s`}
      </EuiButtonEmpty>
    );
  }

  if (props.queryStatus.status === ResultStatus.READY) {
    let message;
    if (!props.queryStatus.elapsedMs) {
      message = 'Completed';
    } else if (props.queryStatus.elapsedMs < 1000) {
      message = `Completed in ${props.queryStatus.elapsedMs} ms`;
    } else {
      message = `Completed in ${Math.floor(props.queryStatus.elapsedMs / 1000)} s`;
    }

    return (
      <EuiButtonEmpty iconSide="left" iconType={'checkInCircleEmpty'} size="xs" onClick={() => {}}>
        <EuiText size="xs" color="subdued" data-test-subj="queryResultCompleteMsg">
          {message}
        </EuiText>
      </EuiButtonEmpty>
    );
  }

  if (!props.queryStatus.body || !props.queryStatus.body.error) {
    return null;
  }

  return (
    <EuiPopover
      button={
        <EuiButtonEmpty
          iconSide="left"
          iconType={'alert'}
          size="xs"
          onClick={onButtonClick}
          data-test-subj="queryResultErrorBtn"
        >
          <EuiText size="xs" color="subdued">
            {'Error'}
          </EuiText>
        </EuiButtonEmpty>
      }
      isOpen={isPopoverOpen}
      closePopover={() => setPopover(false)}
      panelPaddingSize="s"
      anchorPosition={'downRight'}
      data-test-subj="queryResultError"
    >
      <EuiPopoverTitle>ERRORS</EuiPopoverTitle>
      <div style={{ width: '250px' }}>
        <EuiText size="s">
          <strong>
            {i18n.translate('data.query.languageService.queryResults.reasons', {
              defaultMessage: `Reasons:`,
            })}
          </strong>
          {props.queryStatus.body.error.reason}
        </EuiText>
        <EuiText size="s">
          <p>
            <strong>
              {i18n.translate('data.query.languageService.queryResults.details', {
                defaultMessage: `Details:`,
              })}
            </strong>{' '}
            {props.queryStatus.body.error.details}
          </p>
        </EuiText>
      </div>
    </EuiPopover>
  );
}
