# Setup Guide

## Prerequisites

- Node.js 18+ installed
- npm package manager
- Either an Anthropic API key ([Get one here](https://console.anthropic.com/settings/keys)) or an OpenAI API key ([Get one here](https://platform.openai.com/api-keys))

## Installation Steps

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment Variables

Copy the example environment file and add your API key:

```bash
cp .env.example .env.local
```

Then edit `.env.local` and configure your LLM provider:

**For Anthropic (Claude):**

```
LLM_PROVIDER=anthropic
ANTHROPIC_API_KEY=your_actual_api_key_here
```

**For OpenAI (GPT-4):**

```
LLM_PROVIDER=openai
OPENAI_API_KEY=your_actual_api_key_here
```

You can switch between providers anytime by changing the `LLM_PROVIDER` value and providing the corresponding API key.

### 3. Run the Development Server

```bash
npm run dev
```

The application will be available at [http://localhost:3000](http://localhost:3000)

## Available Scripts

- `npm run dev` - Start the development server
- `npm run build` - Build for production
- `npm start` - Start the production server (requires build first)
- `npm run lint` - Run ESLint

## Project Structure

```
.
├── src/
│   ├── components/          # React components
│   │   ├── Layout.tsx       # Main layout wrapper
│   │   ├── ProblemInput.tsx # Problem input form
│   │   ├── ChatPanel.tsx    # Chat interface
│   │   └── StudyPlanView.tsx # Study plan display
│   ├── lib/
│   │   ├── llmClient.ts      # Unified LLM client (supports both providers)
│   │   ├── anthropicClient.ts # Claude API wrapper
│   │   ├── openaiClient.ts   # OpenAI API wrapper
│   │   └── prompts.ts        # Agent system prompts
│   ├── pages/
│   │   ├── index.tsx         # Landing page
│   │   ├── coach.tsx         # Guided problem solving
│   │   ├── critique.tsx      # Solution critique
│   │   ├── planner.tsx       # Study planner
│   │   └── api/              # API routes
│   │       ├── coach.ts
│   │       ├── critique.ts
│   │       └── planner.ts
│   └── styles/
│       └── globals.css       # Global styles
├── package.json
├── tsconfig.json
└── tailwind.config.ts
```

## Multi-Agent Architecture

The application uses specialized LLM agents (works with both Claude and GPT-4):

1. **Decomposer Agent** - Breaks problems into reasoning steps
2. **Socratic Coach Agent** - Guides students with questions and hints
3. **Critic Agent** - Provides detailed feedback on solutions
4. **Planner Agent** - Creates study schedules
5. **Misconception Tracker** - (Optional) Identifies learning patterns

### LLM Provider Support

- **Anthropic Claude**: Uses `claude-sonnet-4-20250514` by default
- **OpenAI GPT**: Uses `gpt-4o` by default
- Switch providers by setting `LLM_PROVIDER` in your `.env.local` file

## Key Features

### Guided Problem Solving (`/coach`)

- Paste a problem to get step-by-step coaching
- Socratic method: hints before answers
- Progressive help levels
- Solution reveal after genuine effort

### Solution Critique (`/critique`)

- Submit problem + your solution
- Get TA-style feedback
- Identify logical gaps and errors
- Structured improvement suggestions

### Study Planner (`/planner`)

- Input course, topics, exam date, study hours
- Get day-by-day schedule
- Spaced repetition built-in
- Checkpoint questions for self-testing

## Development Tips

1. **Hot Reload**: Changes to code auto-reload in dev mode
2. **Type Safety**: TypeScript ensures type correctness
3. **API Routes**: Located in `src/pages/api/` - serverless functions
4. **Styling**: Uses Tailwind CSS for utility-first styling

## Troubleshooting

### Build Errors

- Make sure all dependencies are installed: `npm install`
- Check TypeScript errors: `npm run build`

### API Errors

- Verify your API key is set in `.env.local`
- Check API key has sufficient credits
- Review server logs for detailed error messages

### Styling Issues

- Tailwind CSS should auto-compile
- If styles aren't applying, restart the dev server

## Manim Visualizations (Optional)

QED includes an optional Manim integration for creating mathematical visualizations. This feature uses [Manim](https://github.com/3b1b/manim), the animation engine created by 3Blue1Brown.

### Prerequisites

- Python 3.11+ (check with `python3 --version`)
- LaTeX distribution for rendering mathematical equations:
  - **macOS**: `brew install --cask mactex-no-gui`
  - **Ubuntu/Debian**: `sudo apt-get install texlive-full`
  - **Windows**: Install MiKTeX from https://miktex.org/

### Setup

1. **Install LaTeX** (required for math rendering):

   ```bash
   # macOS
   brew install --cask mactex-no-gui

   # Ubuntu/Debian
   sudo apt-get install texlive texlive-latex-extra
   ```

2. **Set up the Manim service** (already configured):

   ```bash
   cd manim-service
   source venv/bin/activate
   pip install -r requirements.txt
   ```

3. **Start the Manim service**:

   ```bash
   cd manim-service
   ./start.sh
   ```

   Or manually:

   ```bash
   cd manim-service
   source venv/bin/activate
   python api.py
   ```

4. **Configure environment variable** in `.env.local`:

   ```
   MANIM_SERVICE_URL=http://localhost:5001
   ```

5. **Restart your Next.js dev server** to pick up the changes

### Usage

Once configured, the "Generate Visualization" button will appear in the Coach interface. Click it to create animated explanations of math problems!

For detailed documentation, see [manim-service/README.md](manim-service/README.md)

### Skipping Manim

The Manim service is completely optional. The app works perfectly fine without it - you just won't see the "Generate Visualization" feature.

## Deployment

### Vercel (Recommended)

1. Push code to GitHub
2. Import project in Vercel
3. Add environment variables:
   - `LLM_PROVIDER` (set to `anthropic` or `openai`)
   - `ANTHROPIC_API_KEY` (if using Anthropic)
   - `OPENAI_API_KEY` (if using OpenAI)
   - `MANIM_SERVICE_URL` (optional, for visualizations)
4. Deploy!

**Note:** Manim visualizations require a separate Python server and are typically not deployed to Vercel. For production use with visualizations, consider deploying the Manim service to a separate platform like Railway, Render, or AWS.

### Other Platforms

- Build: `npm run build`
- Start: `npm start`
- Ensure environment variables are set

## Academic Integrity

This tool is for **learning and practice only**:

- ✅ Use for understanding concepts
- ✅ Practice problem-solving
- ✅ Study for exams
- ❌ Don't use for graded assignments
- ❌ Don't use during take-home exams
- ❌ Don't submit AI work as your own

## License

MIT License - see LICENSE file
