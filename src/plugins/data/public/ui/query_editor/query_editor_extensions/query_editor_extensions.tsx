/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useMemo } from 'react';
import {
  QueryEditorExtension,
  QueryEditorExtensionConfig,
  QueryEditorExtensionDependencies,
} from './query_editor_extension';

interface QueryEditorExtensionsProps extends QueryEditorExtensionDependencies {
  configMap?: Record<string, QueryEditorExtensionConfig>;
  componentContainer: Element;
  bannerContainer: Element;
  footerContainer: Element;
}

const QueryEditorExtensions: React.FC<QueryEditorExtensionsProps> = React.memo((props) => {
  const {
    configMap,
    componentContainer,
    bannerContainer,
    footerContainer,
    ...dependencies
  } = props;

  const sortedConfigs = useMemo(() => {
    if (!configMap || Object.keys(configMap).length === 0) return [];
    return Object.values(configMap).sort((a, b) => a.order - b.order);
  }, [configMap]);

  console.log('sortedConfigs', sortedConfigs);

  return (
    <>
      {sortedConfigs.map((config) => (
        <QueryEditorExtension
          key={config.id}
          config={config}
          dependencies={dependencies}
          componentContainer={componentContainer}
          bannerContainer={bannerContainer}
          footerContainer={footerContainer}
        />
      ))}
    </>
  );
});

// Needed for React.lazy
// eslint-disable-next-line import/no-default-export
export default QueryEditorExtensions;
