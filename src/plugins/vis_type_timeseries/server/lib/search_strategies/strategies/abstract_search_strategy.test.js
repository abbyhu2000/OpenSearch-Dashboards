/*
 * SPDX-License-Identifier: Apache-2.0
 *
 * The OpenSearch Contributors require contributions made to
 * this file be licensed under the Apache-2.0 license or a
 * compatible open source license.
 *
 * Any modifications Copyright OpenSearch Contributors. See
 * GitHub history for details.
 */

/*
 * Licensed to Elasticsearch B.V. under one or more contributor
 * license agreements. See the NOTICE file distributed with
 * this work for additional information regarding copyright
 * ownership. Elasticsearch B.V. licenses this file to you under
 * the Apache License, Version 2.0 (the "License"); you may
 * not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

import { AbstractSearchStrategy } from './abstract_search_strategy';

describe('AbstractSearchStrategy', () => {
  let abstractSearchStrategy;
  let req;
  let mockedFields;
  let indexPattern;

  beforeEach(() => {
    mockedFields = {};
    req = {
      pre: {
        indexPatternsService: {
          getFieldsForWildcard: jest.fn().mockReturnValue(mockedFields),
        },
      },
    };

    abstractSearchStrategy = new AbstractSearchStrategy('opensearch');
  });

  test('should init an AbstractSearchStrategy instance', () => {
    expect(abstractSearchStrategy.search).toBeDefined();
    expect(abstractSearchStrategy.getFieldsForWildcard).toBeDefined();
    expect(abstractSearchStrategy.checkForViability).toBeDefined();
  });

  test('should return fields for wildcard', async () => {
    const fields = await abstractSearchStrategy.getFieldsForWildcard(req, indexPattern);

    expect(fields).toBe(mockedFields);
    expect(req.pre.indexPatternsService.getFieldsForWildcard).toHaveBeenCalledWith({
      pattern: indexPattern,
      fieldCapsOptions: { allowNoIndices: true },
    });
  });

  test('should return response for local cluster queries', async () => {
    const searches = [{ body: 'body', index: 'index' }];
    const searchFn = jest.fn().mockReturnValue(Promise.resolve({}));

    const responses = await abstractSearchStrategy.search(
      {
        requestContext: {},
        framework: {
          core: {
            getStartServices: jest.fn().mockReturnValue(
              Promise.resolve([
                {},
                {
                  data: {
                    search: {
                      search: searchFn,
                    },
                  },
                },
              ])
            ),
          },
        },
      },
      searches
    );

    expect(responses).toEqual([{}]);
    expect(searchFn).toHaveBeenCalledWith(
      {},
      {
        params: {
          body: 'body',
          index: 'index',
        },
        indexType: undefined,
      },
      {
        strategy: 'opensearch',
      }
    );
  });

  test('should return response for datasource query', async () => {
    const searches = [{ body: 'body', index: 'index' }];
    const searchFn = jest.fn().mockReturnValue(Promise.resolve({}));

    const responses = await abstractSearchStrategy.search(
      {
        requestContext: {},
        framework: {
          core: {
            getStartServices: jest.fn().mockReturnValue(
              Promise.resolve([
                {},
                {
                  data: {
                    search: {
                      search: searchFn,
                    },
                  },
                },
              ])
            ),
          },
        },
      },
      searches,
      {},
      'some-data-source-id'
    );

    expect(responses).toEqual([{}]);
    expect(searchFn).toHaveBeenCalledWith(
      {},
      {
        dataSourceId: 'some-data-source-id',
        params: {
          body: 'body',
          index: 'index',
        },
        indexType: undefined,
      },
      {
        strategy: 'opensearch',
      }
    );
  });
});
