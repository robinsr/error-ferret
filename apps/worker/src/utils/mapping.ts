import type { Review, ModelFinding } from "@errorferret/schemas"
import type { ReviewFeedbackItem, TextFileLocation, FeedbackContext, ReviewFeedbackSource } from "@errorferret/types"
import { SNIPPET_LINES_BEFORE, SNIPPET_LINES_AFTER } from "@errorferret/constants"
import { FERRET_REVIEWERS, type ReviewerProfile } from "@errorferret/reviewers"

import { StableLineIdMap } from "./codefile"


function getReviewer(focus: string): ReviewFeedbackSource {
  let reviewer = FERRET_REVIEWERS.find(r => r.focus === focus) || FERRET_REVIEWERS[0]!

  return {
    name: reviewer.name,
    title: reviewer.title,
    focus: reviewer.focus,
    imageUrl: reviewer.imageUrl,
  }
}



export function toFeedbackItems(review: Review, findings: ModelFinding[]): ReviewFeedbackItem[] {

  const lineIdMap = new StableLineIdMap()
  const artifacts = review.submission.artifacts

  artifacts.forEach(artifact => {
    if (artifact.type === 'file') {
      lineIdMap.addFileArtifact(artifact)
    } else {
      lineIdMap.addRawArtifact(artifact)
    }
  })

  const feedbackItems = findings.map(finding => {
    const { file, lineIds, severity, focus, message: comment, codeQuote } = finding

    const lineId = lineIds[0] || ''

    const filename = lineIdMap.getFileName(lineId)
    const lineNumber = lineIdMap.getLineNumber(lineId)

    if (!filename || !lineNumber) {
      return null
    }

    const location: TextFileLocation = { filename, lineNumber }
    const reviewer: ReviewFeedbackSource = getReviewer(focus)
    const context: FeedbackContext = {
      filename, lines: lineIdMap.getContextLines(lineId, SNIPPET_LINES_BEFORE, SNIPPET_LINES_AFTER)
    }

    return { comment, severity, reviewer, location, context } as ReviewFeedbackItem
  })

  return feedbackItems.filter(item => item !== null) as ReviewFeedbackItem[]
}