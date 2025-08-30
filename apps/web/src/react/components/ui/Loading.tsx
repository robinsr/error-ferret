import type { ReviewStatus } from '@errorferret/types'

import { WAIT_SCREEN } from '@errorferret/branding'

interface LoadingProps {
  status: ReviewStatus
}

export default function Loading({ status }: LoadingProps) {
  return (
    <div id="loadingOverlay" className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-2xl p-8 max-w-md mx-4 text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-400 mx-auto mb-4"></div>
        <h3 className="text-xl font-semibold text-white mb-2">Processing Your Code</h3>
        <p className="text-gray-300">{WAIT_SCREEN}</p>
        <p className="text-gray-300">Review Status: {status}</p>
      </div>
    </div>
  )
}