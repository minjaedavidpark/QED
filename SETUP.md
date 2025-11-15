# Setup Guide

## Prerequisites

- Node.js 18+ installed
- npm package manager
- An Anthropic API key ([Get one here](https://console.anthropic.com/settings/keys))

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

Then edit `.env.local` and add your Anthropic API key:

```
ANTHROPIC_API_KEY=your_actual_api_key_here
```

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
│   │   ├── anthropicClient.ts # Claude API wrapper
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

The application uses specialized Claude agents:

1. **Decomposer Agent** - Breaks problems into reasoning steps
2. **Socratic Coach Agent** - Guides students with questions and hints
3. **Critic Agent** - Provides detailed feedback on solutions
4. **Planner Agent** - Creates study schedules
5. **Misconception Tracker** - (Optional) Identifies learning patterns

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

## Deployment

### Vercel (Recommended)

1. Push code to GitHub
2. Import project in Vercel
3. Add `ANTHROPIC_API_KEY` environment variable
4. Deploy!

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
