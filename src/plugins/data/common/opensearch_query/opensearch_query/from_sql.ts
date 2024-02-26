/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import { decorateQuery } from './decorate_query';
import { getIndexPatternFromSql, sqlStringToDsl } from './sql_string_to_dsl';
import { Query } from '../../query/types';
import { IIndexPattern } from '../../types';
import { DslQuery } from '../kuery';

// export function buildQueryFromSql(
//   indexPattern: IIndexPattern | undefined,
//   queries: Query[] = [],
//   allowLeadingWildcards: boolean = false,
//   dateFormatTZ?: string
// ) {
//   const sqlQueryASTs = (queries || []).map((query) => {
//     return fromSqlExpression(query.query);
//   });

//   return buildQuery(indexPattern, sqlQueryASTs, { dateFormatTZ });
// }

const parse = (expression: string) => {
  // look for keywords
  const from = expression.match(new RegExp(/FROM\s+([\w*-.!@$^()~;]+)/, 'i'));
  const filterField = expression.match(new RegExp(/WHERE\s+([\w*-.!@$^()~;]+)/, 'i'));
};

const fromExpression = (
  expression: string | DslQuery
  //parseOptions: Partial<SQLParseOptions> = {},
  //parse: Function = parseSQL
) => {
  if (typeof expression === 'undefined') {
    throw new Error('expression must be a string, got undefined instead');
  }

  return parse(
    expression
    //{ ...parseOptions, helpers: { nodeTypes } }
  );
};

const fromSqlExpression = (
  expression: string | DslQuery
  //parseOptions: Partial<SQLParseOptions> = {}
) => {
  try {
    return fromExpression(
      expression
      //parseOptions,
      //parseKuery
    );
  } catch (error) {
    // if (error.name === 'SyntaxError') {
    //   throw new SQLSyntaxError(error, expression);
    // } else {
    //   throw error;
    // }
  }
};

function buildQuery(
  indexPattern: IIndexPattern | undefined,
  queryASTs: KueryNode[],
  config: Record<string, any> = {}
) {
  const compoundQueryAST = nodeTypes.function.buildNode('and', queryASTs);
  const kueryQuery = toOpenSearchQuery(compoundQueryAST, indexPattern, config);

  return Object.assign(
    {
      must: [],
      filter: [],
      should: [],
      must_not: [],
    },
    kueryQuery.bool
  );
}
