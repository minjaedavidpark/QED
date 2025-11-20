# AI-Powered Visualization System

## Overview

The QED now features an advanced AI-powered visualization system that can generate mathematical animations for ANY complex problem using Manim (Mathematical Animation Engine).

## How It Works

### Architecture

```
User Problem → LLM Code Generator → Safety Checks → Manim Renderer → Video
```

1. **User submits a problem** via the VisualizationPanel component
2. **LLM generates Manim code** based on the problem description
3. **Safety checks** validate the generated code
4. **Manim renders** the visualization to an MP4 video
5. **Video is served** to the user's browser

### Key Components

#### Frontend

- `src/components/VisualizationPanel.tsx` - UI component for video player and generation button
- `src/pages/api/visualize.ts` - Main API endpoint for visualization requests
- `src/pages/api/generate-manim-code.ts` - AI code generation endpoint

#### Backend

- `manim-service/api.py` - Flask service for Manim rendering
- `manim-service/dynamic_scene_generator.py` - Safe execution of AI-generated code
- `manim-service/scene_generator.py` - Legacy hardcoded scene types (still available)

## Features

### AI Code Generation

The system uses an LLM to generate complete Manim Python code based on problem descriptions:

- Analyzes the problem to determine appropriate visualization approach
- Generates creative, educational animations
- Supports complex problems like TSP, sorting algorithms, graph algorithms, equations, etc.
- Temperature set to 0.7 for creative code generation

### Comprehensive Safety Checks

Multiple layers of security prevent malicious code execution:

**Client-side validation** (in generate-manim-code.ts):

- Blocks dangerous imports: os, sys, subprocess, socket, requests, urllib, pickle
- Blocks file operations: open(), eval(), exec(), compile()
- Blocks introspection: globals(), locals(), **import**()
- Verifies required structure: GeneratedScene class, manim imports

**Server-side sandboxing** (in dynamic_scene_generator.py):

- Restricted built-ins with dangerous functions removed
- Pre-populated namespace with Manim objects
- Import statements stripped from code (objects already available)
- Isolated execution environment

### Supported Problem Types

The AI can visualize virtually any mathematical or algorithmic problem:

- **Equations** - Step-by-step algebraic solutions
- **Graph Algorithms** - BFS, DFS, Dijkstra, TSP, etc.
- **Sorting Algorithms** - Bubble sort, merge sort, quick sort visualizations
- **Geometry** - Shapes, transformations, proofs
- **Number Theory** - Prime factorization, modular arithmetic
- **Calculus** - Limits, derivatives, integrals
- **Linear Algebra** - Matrix operations, transformations
- **Probability** - Distributions, random walks
- **And more!**

## Usage

### From the UI

1. Enter a problem in the ProblemInput component
2. Click "Generate Visualization" in the VisualizationPanel
3. Wait for the AI to generate and render the visualization
4. Watch the video explanation

### From the API

```bash
# Generate visualization for any problem
curl -X POST http://localhost:3000/api/visualize \
  -H "Content-Type: application/json" \
  -d '{"problem": "Visualize the traveling salesman problem with 4 cities"}'

# Response includes video URL
{
  "videoUrl": "http://localhost:5001/video/{id}",
  "videoId": "{id}",
  "explanation": "This visualization shows..."
}
```

### Direct Manim Service API

```bash
# Generate code using AI
curl -X POST http://localhost:3000/api/generate-manim-code \
  -H "Content-Type: application/json" \
  -d '{"problem": "Your problem here"}' \
  | jq .

# Render AI-generated code
curl -X POST http://localhost:5001/generate-dynamic \
  -H "Content-Type: application/json" \
  -d '{"code": "from manim import *\n\nclass GeneratedScene(Scene):..."}'
```

## Configuration

### Environment Variables

```bash
# LLM Provider (anthropic or openai)
LLM_PROVIDER=anthropic

# API Keys
ANTHROPIC_API_KEY=your_key_here
OPENAI_API_KEY=your_key_here

# Manim Service URL
MANIM_SERVICE_URL=http://localhost:5001
```

### LLM Settings

- **Model**: gpt-4o (OpenAI) or claude-sonnet-4-5 (Anthropic)
- **Temperature**: 0.7 for code generation
- **Max Tokens**: 2000
- **Timeout**: 60 seconds for video rendering

### Video Quality

- **Resolution**: 1280x720 (720p)
- **Frame Rate**: 30 fps
- **Format**: MP4
- **Codec**: H.264

## Testing

### Run Tests

```bash
# Test Manim service health
curl http://localhost:5001/health

# Test simple dynamic generation
cd manim-service
python3 test_simple_dynamic.py

# Test complex visualization (TSP)
python3 test_ai_generation.py

# Test full stack (requires Next.js running)
# Visit http://localhost:3000 and use the UI
```

### Expected Results

All tests should pass:

- ✅ Service Health
- ✅ Simple Dynamic Generation
- ✅ Complex Visualization (TSP)

## Troubleshooting

### Video generation fails

1. Check LaTeX is installed: `which latex`
2. Check required packages: `tlmgr list --only-installed | grep -E "standalone|preview"`
3. Check Manim service logs: `tail -f manim-service/manim-service.log`

### AI generates unsafe code

The safety checks should catch this automatically. If not:

- Check the safety patterns in `generate-manim-code.ts`
- Check the restricted builtins in `dynamic_scene_generator.py`

### Service keeps restarting

- Make sure debug mode is disabled in `api.py`
- Temp files are stored in `temp/` directory to avoid auto-reload

## Performance

- Code generation: ~2-5 seconds (depends on LLM)
- Video rendering: ~10-30 seconds (depends on complexity)
- Total time: ~15-35 seconds per visualization

## Future Enhancements

- [ ] Cache generated code for similar problems
- [ ] Support for custom Manim styles/themes
- [ ] Preview generated code before rendering
- [ ] Multiple visualization options for same problem
- [ ] Interactive parameter adjustment
- [ ] Export to different formats (GIF, WEBM)
- [ ] Parallel rendering for faster generation

## Security Notes

⚠️ **Important**: This system executes AI-generated code. While multiple security layers are in place:

1. The execution environment is sandboxed
2. Dangerous operations are blocked
3. Import statements are restricted

However, NO sandboxing is perfect. Only use this system:

- With trusted LLM providers
- In controlled environments
- Not exposed to untrusted users without additional security

## Credits

- **Manim** - Mathematical Animation Engine by 3Blue1Brown
- **Flask** - Python web framework
- **Next.js** - React framework for the frontend
- **Anthropic/OpenAI** - LLM providers for code generation
