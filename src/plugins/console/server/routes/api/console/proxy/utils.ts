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

import { Stream } from 'stream';

/**
 * Checks if a path contains potentially dangerous template names that could be used for XSS attacks
 * @param path The path to check
 * @returns true if the path contains a dangerous template name, false otherwise
 */
export const containsDangerousTemplateName = (path: string): boolean => {
  // This pattern matches common JavaScript functions and objects that could be used for XSS
  const dangerousTemplatePattern = /(_cat\/templates\/|_index_template\/)(eval|javascript|script|function|alert|document|window|location|history|fetch|XMLHttpRequest|Promise|setTimeout|setInterval|constructor|prototype|__proto__|__defineGetter__|__defineSetter__|toString|valueOf)\s*[\(\[\{]/i;
  return dangerousTemplatePattern.test(path);
};

export const buildBufferedBody = (body: Stream): Promise<Buffer> => {
  return new Promise((resolve, reject) => {
    let buff: Buffer = Buffer.alloc(0);

    body.on('data', function (chunk: Buffer) {
      buff = Buffer.concat([buff, chunk]);
    });

    body.on('end', function () {
      resolve(buff);
    });

    body.on('error', function (err) {
      reject(err);
    });
  });
};
