import type { CodeLine } from '@errorferret/types';
import { customAlphabet } from 'nanoid/non-secure'

const lineId = customAlphabet('1234567890abcdef', 4)

/**
 * Parses the user's code into identifiable lines
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
    id: `L-${lineId()}`,
    num: index + 1,
    text: line
  }))
}
