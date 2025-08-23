export function initializeCodeReview() {
  const form = document.getElementById('reviewForm');
  const submitButton = document.querySelector('button[type="submit"]');
  const resultsContainer = document.getElementById('resultsContainer');

  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const formData = new FormData(form);
    const code = formData.get('code');

    if (!code || code.trim() === '') {
      showError('Please enter some code to review.');
      return;
    }

    // Show loading state
    setLoading(true);
    hideResults();

    const payload = {
      code,
      language: 'javascript',
      focus: 'general',
    }

    console.log('Sending review request:', payload);

    try {
      const response = await fetch('/api/review.json', {
        method: 'POST',
        body: JSON.stringify(payload),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to get review');
      }

      showResults(data);
    } catch (error) {
      console.error('Review error:', error);
      showError(error.message || 'An error occurred while getting the review.');
    } finally {
      setLoading(false);
    }
  });

  function setLoading(isLoading) {
    if (submitButton) {
      submitButton.disabled = isLoading;
      submitButton.innerHTML = isLoading
        ? '<svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>Processing...'
        : '<svg class="w-5 h-5 mr-3 group-hover:animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path></svg>Analyze Code with AI';
    }
  }

  function showResults(data) {
    if (!resultsContainer) return;

    const { review, language, focus, timestamp } = data;

    resultsContainer.innerHTML = `
      <div class="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
        <div class="px-8 py-6 border-b border-gray-200 bg-gradient-to-r from-green-600 to-emerald-600">
          <h2 class="text-2xl font-semibold text-white">
            Error Ferret Results
          </h2>
          <div class="flex items-center space-x-4 mt-2 text-green-100 text-sm">
            <span>Language: ${language}</span>
            <span>Focus: ${focus}</span>
            <span>${new Date(timestamp).toLocaleString()}</span>
          </div>
        </div>

        <div class="p-8">
          <div class="prose prose-lg max-w-none">
            <div class="whitespace-pre-wrap font-mono text-sm bg-gray-50 p-6 rounded-lg border overflow-x-auto">
              ${escapeHtml(review)}
            </div>
          </div>

          <div class="mt-6 flex justify-center">
            <button
              onclick="window.location.reload()"
              class="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors duration-200"
            >
              Analyze Another Code
            </button>
          </div>
        </div>
      </div>
    `;

    resultsContainer.classList.remove('hidden');
    resultsContainer.scrollIntoView({ behavior: 'smooth' });
  }

  function showError(message) {
    if (!resultsContainer) return;

    resultsContainer.innerHTML = `
      <div class="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
        <div class="px-8 py-6 border-b border-gray-200 bg-gradient-to-r from-red-600 to-pink-600">
          <h2 class="text-2xl font-semibold text-white">
            Error
          </h2>
        </div>

        <div class="p-8 text-center">
          <div class="text-red-600 mb-4">
            <svg class="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
            </svg>
            <p class="text-lg">${escapeHtml(message)}</p>
          </div>

          <button
            onclick="window.location.reload()"
            class="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors duration-200"
          >
            Try Again
          </button>
        </div>
      </div>
    `;

    resultsContainer.classList.remove('hidden');
    resultsContainer.scrollIntoView({ behavior: 'smooth' });
  }

  function hideResults() {
    if (resultsContainer) {
      resultsContainer.classList.add('hidden');
    }
  }

  function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }
}
