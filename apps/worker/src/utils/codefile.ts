import type { CodeLine } from '@errorferret/types';

import hash from '@emotion/hash'


/**
 * Generates a unique ID for a line of code using murmurhash3
 *
 * This is a simple way to generate a unique ID for a line of code
 * that is deterministic and can be used to identify the line in the code
 *
 * This is useful for the LLM to reference the line of code in the codebase
 * and for the user to reference the line of code in the codebase
 *
 * @param line - The line of code to generate an ID for
 * @returns A unique ID for the line of code
 */
function getLineId(line: string): string {
  return hash(line);
}

/**
 * Parses the user's code into identifiable lines
 *
 * Returns the "lines" array with a unique ID for each line,
 *
 * ```json
 * {
 *   "file": "src/foo.ts",
 *   "lines": [
 *     {"id":"L-2c7f", "num":41, "text":"const cache = new Map<string, User>();"},
 *     {"id":"L-88b1", "num":42, "text":"export async function getUser(id: string) {"},
 *   ]
 * }
 * ```
*/
export function parseCodeFile(code: string): CodeLine[] {
  const lines = code.split('\n');

  return lines.map((line, index) => ({
    id: `L-${getLineId(line)}`,
    num: index + 1,
    text: line
  }))
}
