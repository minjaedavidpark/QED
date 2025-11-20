This service provides mathematical visualization capabilities for QED using [Manim](https://github.com/3b1b/manim) - the animation engine created by 3Blue1Brown.

## What is Manim?

Manim is a Python library for creating mathematical animations and visualizations. It's the same tool used to create 3Blue1Brown's famous math videos on YouTube.

## Features

The service can generate visualizations for:

- **Equations**: Step-by-step equation solving with animated transformations
- **Graphs**: Function plotting with customizable ranges and labels
- **Geometry**: Geometric shapes, transformations, and proofs
- **Number Lines**: Interactive number line representations
- **Functions**: Function transformations and comparisons
- **Generic**: Text-based problem breakdowns

## Prerequisites

- Python 3.11+ (installed)
- LaTeX distribution (for rendering mathematical equations)
  - **macOS**: `brew install --cask mactex-no-gui`
  - **Ubuntu/Debian**: `sudo apt-get install texlive-full`
  - **Windows**: Install MiKTeX from https://miktex.org/

## Setup

### 1. Install System Dependencies

**macOS:**

```bash
# Install LaTeX (required for rendering math)
brew install --cask mactex-no-gui

# Or use the smaller version
brew install --cask basictex
```

**Ubuntu/Debian:**

```bash
sudo apt-get update
sudo apt-get install -y \
    texlive \
    texlive-latex-extra \
    texlive-fonts-extra \
    texlive-latex-recommended \
    texlive-science \
    ffmpeg
```

### 2. Set Up Python Virtual Environment

The virtual environment and dependencies should already be set up. If not:

```bash
cd manim-service
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

### 3. Test Installation

Test that Manim is working correctly:

```bash
source venv/bin/activate
python -c "from manim import *; print('Manim installed successfully!')"
```

## Running the Service

### Development Mode

Start the Flask API server:

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

The service will start on `http://localhost:5001`

### Verify Service is Running

```bash
curl http://localhost:5001/health
```

Expected response:

```json
{ "status": "healthy", "service": "manim-visualizer" }
```

## API Endpoints

### Health Check

```
GET /health
```

### Generate Visualization

```
POST /generate
Content-Type: application/json

{
  "type": "equation",
  "equation": "x^2 + 2x + 1 = 0",
  "steps": [
    "x^2 + 2x + 1 = 0",
    "(x + 1)^2 = 0",
    "x = -1"
  ]
}
```

Response:

```json
{
  "success": true,
  "video_id": "uuid-here",
  "video_url": "/manim/video/uuid-here",
  "file_path": "/path/to/video.mp4"
}
```

### Get Video

```
GET /video/<video_id>
```

Returns the MP4 video file.

### Cleanup

```
POST /cleanup
```

Removes all generated video files.

## Visualization Types

### 1. Equation Solving

```json
{
  "type": "equation",
  "equation": "x^2 + 5x + 6 = 0",
  "steps": ["x^2 + 5x + 6 = 0", "(x + 2)(x + 3) = 0", "x = -2 \\text{ or } x = -3"]
}
```

### 2. Function Graphing

```json
{
  "type": "graph",
  "function": "x**2",
  "content": "Parabola y = x²"
}
```

### 3. Geometry

```json
{
  "type": "geometry",
  "shapes": [
    { "type": "circle", "radius": 1 },
    { "type": "square", "side": 2 }
  ]
}
```

### 4. Number Line

```json
{
  "type": "number_line",
  "start": -5,
  "end": 5,
  "points": [
    { "value": -2, "label": "a" },
    { "value": 3, "label": "b" }
  ]
}
```

### 5. Function Visualization

```json
{
  "type": "function",
  "content": "Function transformation"
}
```

### 6. Generic Text

```json
{
  "type": "generic",
  "content": "Problem breakdown and explanation"
}
```

## Integration with Next.js

The Next.js app connects to this service via the `/api/visualize` endpoint. Make sure to:

1. Start the Manim service on port 5001
2. Set `MANIM_SERVICE_URL=http://localhost:5001` in your `.env.local`
3. The visualization panel will automatically appear in the coach interface

## Troubleshooting

### "LaTeX Error: File not found"

Install a LaTeX distribution (see Prerequisites above).

### "ModuleNotFoundError: No module named 'manim'"

Activate the virtual environment:

```bash
source venv/bin/activate
```

### Videos Not Generating

Check the Manim service logs:

```bash
cd manim-service
source venv/bin/activate
python api.py
```

Look for error messages when generating visualizations.

### Port 5001 Already in Use

Change the port in `api.py`:

```python
app.run(host='0.0.0.0', port=5002, debug=True)
```

And update `MANIM_SERVICE_URL` in `.env.local`:

```
MANIM_SERVICE_URL=http://localhost:5002
```

## File Structure

```
manim-service/
├── venv/                 # Python virtual environment
├── media/                # Generated videos (auto-created)
├── api.py               # Flask API server
├── scene_generator.py   # Manim scene definitions
├── requirements.txt     # Python dependencies
├── start.sh            # Startup script
├── .gitignore          # Git ignore rules
└── README.md           # This file
```

## Performance Notes

- Video generation typically takes 5-30 seconds depending on complexity
- Videos are cached in the `media/` directory
- Use the `/cleanup` endpoint to remove old videos
- For production, consider using a task queue (Celery, RQ) for async processing

## Development

### Adding New Visualization Types

1. Add a new method to `MathProblemScene` in `scene_generator.py`
2. Update the `construct()` method to route to your new visualization
3. Test locally before deploying

Example:

```python
def visualize_matrix(self):
    """Visualize matrix operations"""
    matrix_data = self.problem_data.get('matrix', [[1, 2], [3, 4]])
    # Your visualization code here
```

### Customizing Animations

Modify the scene classes in `scene_generator.py`. See the [Manim documentation](https://docs.manim.community/) for more details.

## Resources

- [Manim Community Docs](https://docs.manim.community/)
- [3Blue1Brown YouTube](https://www.youtube.com/c/3blue1brown)
- [Manim Examples](https://docs.manim.community/en/stable/examples.html)

## License

This service uses Manim (MIT License) and is part of the QED project.
