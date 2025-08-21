# Setup Guide for Code Review Tool

## Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- OpenAI API key
- Cloudflare account (for deployment)

## Installation

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file in the root directory:
```bash
cp env.template .env
```

3. Add your OpenAI API key to the `.env` file:
```env
OPENAI_API_KEY=your_actual_api_key_here
```

You can get your OpenAI API key from: https://platform.openai.com/api-keys

## Running the Application

### Development Mode
```bash
npm run dev
```

The application will be available at `http://localhost:4321`

### Build for Production
```bash
npm run build
npm run preview
```

## Deployment to Cloudflare Workers

### Prerequisites
1. Install Wrangler CLI:
```bash
npm install -g wrangler
```

2. Login to Cloudflare:
```bash
wrangler login
```

### Environment Variables Setup
Set your OpenAI API key as a Cloudflare secret:
```bash
wrangler secret put OPENAI_API_KEY
```

### Deploy
```bash
npm run build
wrangler deploy
```

### Alternative: Deploy via Cloudflare Dashboard
1. Build the project: `npm run build`
2. Upload the `dist` folder to Cloudflare Pages
3. Set environment variables in the Cloudflare dashboard

## How It Works

1. **Frontend**: Users submit code through a form with optional language and focus selections
2. **Backend**: The `/api/review` endpoint processes the form data
3. **OpenAI Integration**: Constructs a prompt and sends it to OpenAI's GPT-4 model
4. **Results Display**: Shows the AI-generated code review with proper formatting

## API Endpoints

- `POST /api/review` - Submit code for review
  - Body: FormData with `code`, `language` (optional), `focus` (optional)
  - Returns: JSON with review results or error message

## Configuration Files

- **`astro.config.mjs`**: Astro configuration with Cloudflare adapter
- **`wrangler.toml`**: Cloudflare Workers configuration
- **`.env`**: Local environment variables (not committed to git)

## Customization

### System Prompts
Edit the system prompt in `src/pages/api/review.astro` to customize the AI's behavior.

### Model Parameters
Modify the OpenAI API call parameters in the same file:
- `model`: Change from `gpt-4` to other models
- `max_tokens`: Adjust response length
- `temperature`: Control creativity vs consistency

### Styling
The application uses Tailwind CSS. Modify classes in the Astro components to change the appearance.

## Troubleshooting

### Common Issues

1. **"OpenAI API key not configured"**
   - Make sure you have a `.env` file with `OPENAI_API_KEY`
   - Restart the development server after adding the environment variable
   - For production: Ensure the secret is set in Cloudflare

2. **"Failed to get AI review"**
   - Check your OpenAI API key is valid
   - Ensure you have sufficient API credits
   - Check the browser console for detailed error messages

3. **Form not submitting**
   - Check browser console for JavaScript errors
   - Ensure all required fields are filled

4. **Build errors**
   - Ensure `@astrojs/cloudflare` is installed
   - Check that `output: 'server'` is set in astro.config.mjs

## Security Notes

- Never commit your `.env` file to version control
- The OpenAI API key is only used server-side
- Consider implementing rate limiting for production use
- Add authentication if deploying publicly
- Use Cloudflare secrets for sensitive environment variables
