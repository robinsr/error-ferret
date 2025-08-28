import type { ReviewerProfile } from '@errorferret/reviewers';
import type { ReviewStatus } from '@errorferret/types'

import React, { useEffect, useState } from 'react'
import { createReviewFromPaste, getReview } from './lib/api'

import ErrorMsg from '@react-components/ErrorMsg.tsx'
import Features from '@react-components/Features.tsx'
import Header from '@react-components/Header.tsx'
import Loading from '@react-components/Loading.tsx'
import Section from '@react-components/Section.tsx'

import SubmitButton from '@react-components/InputForm/SubmitButton'
import TextareaInput from '@react-components/InputForm/TextareaInput'
import ReviewerSelector from '@react-components/InputForm/ReviewerSelector'
import FileUploadInput from '@react-components/InputForm/FileUploadInput'

import { FERRET_REVIEWERS } from '@errorferret/reviewers'


type InputMode = 'paste' | 'upload'

export default function App() {
  const [reviewId, setReviewId] = useState<string | null>(null)
  const [status, setStatus] = useState<ReviewStatus>('idle')
  const [error, setError] = useState<string | null>(null)
  const [inputMode, setInputMode] = useState<InputMode>('paste')
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])

  const [reviewers, setReviewers] = useState<ReviewerProfile[]>(
    FERRET_REVIEWERS.filter(r => r.focus === 'general')
  )

  const [code, setCode] = useState<string>('')
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)

  async function onSubmit() {
    setIsSubmitting(true)
    setError(null)
    setStatus('creating')

    try {
      const { reviewId } = await createReviewFromPaste(reviewers, code)
      setReviewId(reviewId)
      setStatus('queued')
    } catch (e: any) {
      setError(e.message)
      setStatus('idle')
    }
  }

  useEffect(() => {
    if (!reviewId) return

    let timer: number

    const tick = async () => {
      try {
        const review = await getReview(reviewId)

        setStatus(review.status)

        if (review.status === 'complete') {
          window.location.href = `/review/${reviewId}`
        }

        if (review.status === 'failed') {
          setError('Failed to generate feedback')
        }

        if (review.status === 'idle') {
          setError('Review not found')
        }

        if (review.status === 'creating') {
          setError('Review is being created')
        }

        if (review.status !== 'complete' && review.status !== 'failed') {
          timer = window.setTimeout(tick, 600) // simple poll
        }
      } catch (e: any) {
        setError(e.message)
      }
    }

    tick()

    return () => window.clearTimeout(timer)
  }, [reviewId])

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    onSubmit()
  }

  return (
    <main style={{ fontFamily: 'system-ui, sans-serif', padding: 24 }}>

      <Header />

        <Section title="Submit Code for Review" description="Paste your code below and get instant feedback" colorScheme="blue">

          <form id="reviewForm" className="p-8 space-y-6" onSubmit={handleSubmit}>

            <div className="flex justify-center">
              <div className="bg-gray-100 p-1 rounded-lg flex">
                <button
                  type="button"
                  onClick={() => setInputMode('paste')}
                  className={`px-6 py-2 rounded-md font-medium transition-all duration-200 ${
                    inputMode === 'paste'
                      ? 'bg-white text-blue-600 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                  Paste your code
                </button>
                <button
                  type="button"
                  onClick={() => setInputMode('upload')}
                  className={`px-6 py-2 rounded-md font-medium transition-all duration-200 ${
                    inputMode === 'upload'
                      ? 'bg-white text-blue-600 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                  Upload files
                </button>
              </div>
            </div>

            {inputMode == 'paste' && (
              <TextareaInput name="code" label="Code to Review" onChange={setCode} />
            )}

            {inputMode == 'upload' && (
              <FileUploadInput selectedFiles={selectedFiles} onFilesChange={setSelectedFiles} />
            )}

            <ReviewerSelector selectedReviewers={reviewers} onSelectionChange={setReviewers} />

            <div className="flex items-center justify-center pt-4">
              <SubmitButton />
            </div>
          </form>
      </Section>

      <Features />

      {error && (
        <Section title="Error" description="An error occurred while generating feedback" colorScheme="red">
          <ErrorMsg error={error} />
        </Section>
      )}

    {isSubmitting && (
      <Loading status={status}  />
    )}

    </main>
  )
}