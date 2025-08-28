import type { CreateReviewRequest, CreateReviewResponse, Review, ReviewArtifact } from '@errorferret/types'

import type { ReviewerProfile } from '@errorferret/reviewers'


const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:3000'


/**
 * Calls the API layer to create a new review
 * @param reviewers - The reviewers to use for the review
 * @param artifacts - The artifacts to use for the review
 * @returns The review ID
 */
export async function createReviewFromArtifacts(reviewers: ReviewerProfile[], artifacts: ReviewArtifact[]): Promise<CreateReviewResponse> {
  const payload: CreateReviewRequest = {
    reviewers: reviewers.map(r => r.focus),
    artifacts: artifacts
  }

  const createReviewResponse = await fetch(`${API_BASE}/api/reviews`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  })

  if (!createReviewResponse.ok) {
    const errText = await createReviewResponse.text()
    console.error(`createReview failed: ${createReviewResponse.status} - ${errText}`)
    throw new Error(`createReview failed: ${createReviewResponse.status}`)
  }

  const response = await createReviewResponse.json() as CreateReviewResponse

  console.log('createReviewResponse', response)

  return response
}


/**
 * Utility function to create a review from a paste of code
 * @param reviewers
 * @param code
 * @returns
 */
export async function createReviewFromPaste(reviewers: ReviewerProfile[], code: string): Promise<CreateReviewResponse> {
  const artifacts: ReviewArtifact[] = [
    { type: 'raw', code }
  ]

  return createReviewFromArtifacts(reviewers, artifacts)
}


/**
 * Calls the API layer to fetch a Review by ID
 */
export async function getReview(id: string): Promise<Review> {

  const getReviewRequest = await fetch(`${API_BASE}/api/reviews/${id}`)

  if (!getReviewRequest.ok) {
    const errText = await getReviewRequest.text()
    console.error(`getReview failed: ${getReviewRequest.status} - ${errText}`)
    throw new Error(`getReview failed: ${getReviewRequest.status}`)
  }

  const response = await getReviewRequest.json() as Review

  console.log('getReviewResponse', response)

  return response
}