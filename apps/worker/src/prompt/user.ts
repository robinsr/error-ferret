import type { Review, ReviewFileArtifact, ReviewRawArtifact } from '@errorferret/schemas';
import type { CodeFile } from '@errorferret/types';
import { MAX_FEEDBACK_ITEMS } from '@errorferret/constants';
import { parseArtifact } from '../utils/codefile';

import { getFocusValueKeys } from './rubric';



function prepareFileArtifact(artifact: ReviewFileArtifact): CodeFile {
  const lines = parseArtifact(artifact);
  const filename = artifact.filename;

  return { filename, lines };
}

function prepareRawArtifact(artifact: ReviewRawArtifact): CodeFile {
  const lines = parseArtifact(artifact);

  return { filename: "text", lines };
}

function printFileBlockV1(codeObject: CodeFile, index: number): string {
  const lines = codeObject.lines.map((line) => {
    return `    {"id": "${line.id}", "n": ${line.num}, "text": "${line.text}"}`
  })

  return `FILE: ${index}
{
  "file": "${codeObject.filename}",
  "lines": [
${lines.join(',\n')}
  ]
}
---`
}

function printFileBlockV2(codeObject: CodeFile, index: number): string {
  const lines = codeObject.lines.map((line) => {
    return `${line.id}: ${line.text}`
  })

  return `
FILE: ${index}
${lines.join('\n')}`
}


export const generateUserPrompt = (review: Review): string => {

  const codeObjects = review.submission.artifacts.map((artifact) => {
    if (artifact.type === 'file') {
      return prepareFileArtifact(artifact);
    }

    return prepareRawArtifact(artifact);
  })

  const objectCount = codeObjects.length;
  const codeBlocks = codeObjects.map((codeObject, index) => printFileBlockV2(codeObject, index + 1))

  console.log("Code blocks", codeBlocks)


  const message = `
FILES: ${objectCount}
---
${codeBlocks.join('\n---\n')}
---
FOCUS_AREAS: ${getFocusValueKeys(review).join(', ')}
`

  return ['<user_code>', message, '</user_code>'].join('\n')
};