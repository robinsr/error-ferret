import React, { useEffect, useState } from 'react'
import { createReview, getReview } from './lib/api'

import {
  ErrorMsg,
  Features,
  FileUploadInput,
  Header,
  ReviewerSelector,
  Section,
  SubmitButton,
  TextareaInput
} from '@errorferret/ui-react'

import { CODE_PLACEHOLDER } from '@errorferret/constants'
import { FERRET_REVIEWERS } from '@errorferret/reviewers'
import { WAIT_SCREEN } from '@errorferret/branding'


type InputMode = 'paste' | 'upload'

export default function App() {
  const [reviewId, setReviewId] = useState<string | null>(null)
  const [status, setStatus] = useState<string>('idle')
  const [items, setItems] = useState<any[]>([])
  const [error, setError] = useState<string | null>(null)

  const [inputMode, setInputMode] = useState<InputMode>('paste')

  const [selectedFiles, setSelectedFiles] = useState<File[]>([])
  const [reviewers, setReviewers] = useState<string[]>(['general'])

  const [code, setCode] = useState<string>('')

  const [isLoading, setIsLoading] = useState<boolean>(false)

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)

  async function start() {
    setError(null)
    setItems([])
    setStatus('creating')
    try {
      const { reviewId } = await createReview()
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
        const s = await getReview(reviewId)
        setStatus(s.status)
        if (s.status === 'complete' && s.items) setItems(s.items)
        if (s.status !== 'complete' && s.status !== 'failed') {
          timer = window.setTimeout(tick, 600) // simple poll
        }
      } catch (e: any) {
        setError(e.message)
      }
    }
    tick()
    return () => window.clearTimeout(timer)
  }, [reviewId])

  return (
    <main style={{ fontFamily: 'system-ui, sans-serif', padding: 24 }}>

      <Header />

        <Section title="Submit Code for Review" description="Paste your code below and get instant feedback" colorScheme="blue">

          <form id="reviewForm" className="p-8 space-y-6">

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

            {/*-- Code Input Section --*/}
            <div x-show="inputMode === 'paste'">
              <TextareaInput name="code" label="Code to Review" content={''} placeholder={CODE_PLACEHOLDER} />
            </div>

            {/*-- File Upload Section --*/}
            <div x-show="inputMode === 'upload'">
              <FileUploadInput />
            </div>

            {/*-- Reviewer Selection --*/}
            <ReviewerSelector reviewers={FERRET_REVIEWERS} />

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

      <div id="loadingOverlay" className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 hidden">
        <div className="bg-white rounded-2xl p-8 max-w-md mx-4 text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Processing Your Code</h3>
          <p className="text-gray-600">{WAIT_SCREEN}</p>
        </div>
      </div>
    </main>
  )
}