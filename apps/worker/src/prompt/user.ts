import type { Review, ReviewFileArtifact, ReviewRawArtifact } from '@errorferret/schemas';
import type { CodeFile } from '@errorferret/types';
import { MAX_FEEDBACK_ITEMS } from '@errorferret/constants';
import { parseCodeFile } from '../utils/codefile';

import { getFocusValueKeys } from './rubric';



function prepareFileArtifact(artifact: ReviewFileArtifact): CodeFile {
  const lines = parseCodeFile(artifact.code);
  const filename = artifact.filename;

  return { filename, lines };
}

function prepareRawArtifact(artifact: ReviewRawArtifact): CodeFile {
  const lines = parseCodeFile(artifact.code);

  return { filename: "", lines };
}

function printCodeObject(codeObject: CodeFile, index: number): string {
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

export const generateUserPrompt = (review: Review): string => {

  const codeObjects = review.submission.artifacts.map((artifact) => {
    if (artifact.type === 'file') {
      return prepareFileArtifact(artifact);
    }

    return prepareRawArtifact(artifact);
  })

  const objectCount = codeObjects.length;

  console.log("Parsed code in user prompt", codeObjects)


  const message = `
FILES: ${objectCount}
---
${codeObjects.map((codeObject, index) => printCodeObject(codeObject, index + 1)).join('\n')}
---
FOCUS_AREAS: ${getFocusValueKeys(review).join(', ')}
`

  return ['<user_code>', message, '</user_code>'].join('\n')
};