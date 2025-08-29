import type {
  CodeLine,
  ReviewArtifactFile,
  ReviewArtifactRaw,
  FeedbackContextLine,
  ReviewArtifact
} from '@errorferret/types';

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
function newLineId(line: string, lineNumber: number, filename: string = 'text'): string {
  if (line.trim() === '') {
    return hash(`${filename}:${lineNumber}`)
  }

  return hash(`${filename}:${lineNumber}:${line}`);
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
export function parseArtifact(artifact: ReviewArtifact): CodeLine[] {
  const filename = artifact.type == 'file' ? artifact.filename : 'text'
  const lines = artifact.code.split('\n');

  return lines.map((line, index) => ({
    id: `L-${newLineId(line, index + 1, filename)}`,
    num: index + 1,
    text: line
  }))
}


type LineIdMapping = Record<string, number>
type FileNameMapping = Record<string, string>


/**
 * Generates a mapping of stable line IDs to the original line numbers
 *
 * ```json
 * {
 *   "L-2c7f": 41,
 *   "L-88b1": 42,
 * }
 * ```
 *
 * This is useful for mapping the line IDs from the model findings to the original line numbers
 * in the codebase
 *
 * @param lines - The lines to generate a mapping for
 * @returns A mapping of stable line IDs to the original line numbers
 */
function stableLineIdMap(lines: CodeLine[]): LineIdMapping {
  return lines.reduce((acc, line) => ({
    ...acc, [line.id]: line.num
  }), {} as LineIdMapping)
}

/**
 * Generates a mapping of line IDs to file names
 *
 * ```json
 * {
 *   "L-2c7f": "src/foo.ts",
 *   "L-88b1": "src/foo.ts",
 * }
 * ```
 *
 * @param lineIds - The line IDs to generate a mapping for
 * @param filename - The file name to map the line IDs to
 * @returns A mapping of line IDs to file names
 */
function toFileNameMapping(lines: CodeLine[], filename: string): FileNameMapping {
  const lineIds = lines.map(line => line.id)

  return lineIds.reduce((acc, lineId) => ({
    ...acc, [lineId]: filename
  }), {} as FileNameMapping)
}




export class StableLineIdMap {
  private lineNumberMap: LineIdMapping
  private fileNameMap: FileNameMapping
  private allCodeLines: CodeLine[]

  constructor() {
    this.lineNumberMap = {}
    this.fileNameMap = {}
    this.allCodeLines = []
  }

  /**
   * Updates the internal line number and file name mappings
   * with the lineIds from a file artifact
   *
   * @param artifact - The file artifact to add to the mapping
   */
  addFileArtifact(artifact: ReviewArtifactFile) {
    const codeLines = parseArtifact(artifact)

    this.allCodeLines = [...this.allCodeLines, ...codeLines]

    this.lineNumberMap = {
      ...this.lineNumberMap, ...stableLineIdMap(codeLines)
    }

    this.fileNameMap = {
      ...this.fileNameMap, ...toFileNameMapping(codeLines, artifact.filename)
    }
  }

  /**
   * Updates the internal line number and file name mappings
   * with the lineIds from a raw artifact
   *
   * @param artifact - The raw artifact to add to the mapping
   */
  addRawArtifact(artifact: ReviewArtifactRaw) {
    this.addFileArtifact({
      type: 'file',
      filename: 'text',
      code: artifact.code,
    })
  }

  /**
   * Gets the file name for a given line ID
   *
   * @param lineId - The line ID to get the file name for
   * @returns The file name for the given line ID
   */
  getFileName(lineId: string): string | undefined {
    return this.fileNameMap[lineId]
  }

  /**
   * Gets the line number for a given line ID
   *
   * @param lineId - The line ID to get the line number for
   * @returns The line number for the given line ID
   */
  getLineNumber(lineId: string): number | undefined {
    return this.lineNumberMap[lineId]
  }

  /**
   * Returns an ordered list of line IDs for a given file
   *
   * @param filename - The file to get the line IDs for
   * @returns The ordered list of line IDs for the given file
   */
  getFileLineIds(filename: string): string[] {
    const lineIds = Object.keys(this.lineNumberMap)

    return lineIds.filter(id => this.getFileName(id) === filename)
  }

  /**
   * Returns a set of line IDs containing the supplied line ID and
   * the desired number of lines before and after the supplied line ID
   *
   * @param lineId - The line ID to get the context line IDs for
   * @param before - The number of lines before the given line ID
   * @param after - The number of lines after the given line ID
   * @returns The context line IDs for the given line ID
   */
  getContextLineIds(lineId: string, before: number, after: number): string[] {
    const lineNumber = this.getLineNumber(lineId)
    const filename = this.getFileName(lineId)

    if (!filename || !lineNumber) {
      return []
    }

    const fileLineIds = this.getFileLineIds(filename)
    const start = Math.max(0, lineNumber - before)
    const end = Math.min(fileLineIds.length, lineNumber + after)

    return fileLineIds.slice(start, end)
  }

  getContextLines(lineId: string, before: number, after: number): FeedbackContextLine[] {
    const lineIds = this.getContextLineIds(lineId, before, after)

    const codeLines = this.allCodeLines.filter(line => lineIds.includes(line.id))

    const contextLines: FeedbackContextLine[] = lineIds
      .map(id => ({
        lineNumber: this.getLineNumber(id) || -1,
        code: codeLines.find(line => line.id === id)?.text || ''
      }))
      .filter(line => line.lineNumber !== -1)

    return contextLines
  }
}

