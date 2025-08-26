const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:3000'


/**
 * Calls the API layer to create a new review
 */
export async function createReview(): Promise<{ reviewId: string }> {
  const createReviewRequest = await fetch(`${API_BASE}/api/reviews`, {
    method: 'POST'
  })

  if (!createReviewRequest.ok) {
    const errText = await createReviewRequest.text()
    console.error(`createReview failed: ${createReviewRequest.status} - ${errText}`)
    throw new Error(`createReview failed: ${createReviewRequest.status}`)
  }

  return createReviewRequest.json()
}


/**
 * Calls the API layer to fetch a Review by ID
 */
export async function getReview(id: string) {

  const getReviewRequest = await fetch(`${API_BASE}/api/reviews/${id}`)

  if (!getReviewRequest.ok) {
    const errText = await getReviewRequest.text()
    console.error(`getReview failed: ${getReviewRequest.status} - ${errText}`)
    throw new Error(`getReview failed: ${getReviewRequest.status}`)
  }

  return getReviewRequest.json() as Promise<{
    reviewId: string
    status: 'pending' | 'processing' | 'complete' | 'failed'
    items?: Array<{ line: number; column: number; issue: string; suggestion: string; severity: string }>
  }>
}