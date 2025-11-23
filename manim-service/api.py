"""
Simple Flask API for generating Manim visualizations
"""
from flask import Flask, request, jsonify, send_file, Response
from flask_cors import CORS
import json
import os
import subprocess
import uuid
import shutil
import sys
from pathlib import Path
from dotenv import load_dotenv

# Try to import TTS generator, but don't fail if it's not available
try:
    from tts_generator import generate_tts, combine_video_audio
    TTS_AVAILABLE = True
except ImportError as e:
    print(f"[WARNING] TTS generator not available: {e}")
    TTS_AVAILABLE = False
    generate_tts = None
    combine_video_audio = None

# Load environment variables from parent directory's .env.local
parent_env = Path(__file__).parent.parent / '.env.local'
if parent_env.exists():
    load_dotenv(parent_env)
    print(f"[ENV] Loaded environment from {parent_env}")
else:
    print(f"[ENV] No .env.local file found at {parent_env}, using environment variables")

# Determine Python executable path
# In Docker/production: use 'python' or sys.executable
# In development: use venv python if available
venv_python = Path('./venv/bin/python')
PYTHON_PATH = str(venv_python) if venv_python.exists() else sys.executable
print(f"[STARTUP] Using Python: {PYTHON_PATH}")

# Ensure LaTeX is in PATH
latex_path = "/Library/TeX/texbin"
if os.path.exists(latex_path) and latex_path not in os.environ.get('PATH', ''):
    os.environ['PATH'] = f"{latex_path}:{os.environ.get('PATH', '')}"

app = Flask(__name__)
CORS(app)

# Configuration
MEDIA_DIR = Path("./media")
MEDIA_DIR.mkdir(exist_ok=True)

TEMP_DIR = Path("./temp")
TEMP_DIR.mkdir(exist_ok=True)

print(f"[STARTUP] Flask app initialized")
print(f"[STARTUP] Media directory: {MEDIA_DIR.absolute()}")
print(f"[STARTUP] Temp directory: {TEMP_DIR.absolute()}")
print(f"[STARTUP] TTS available: {TTS_AVAILABLE}")


@app.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({"status": "healthy", "service": "manim-visualizer"})


@app.route('/generate-dynamic', methods=['POST'])
def generate_dynamic_visualization():
    """
    Generate visualization using AI-generated Manim code with optional TTS
    Streams progress updates via SSE
    """
    try:
        data = request.json
        code = data.get('code')
        narration = data.get('narration', '')  # Optional TTS text

        if not code:
            return jsonify({"error": "No code provided"}), 400

        # Generate unique ID
        viz_id = str(uuid.uuid4())
        output_file = f"scene_{viz_id}"

        # Write code to temporary file (in temp dir to avoid Flask auto-reload)
        code_file = TEMP_DIR / f"{viz_id}.py"
        with open(code_file, 'w') as f:
            f.write(code)

        def generate():
            try:
                # Get absolute paths
                script_dir = os.path.dirname(os.path.abspath(__file__))
                generator_script = os.path.join(script_dir, 'dynamic_scene_generator.py')

                # Verify script exists
                if not os.path.exists(generator_script):
                    yield f"data: {json.dumps({'type': 'error', 'error': f'Script not found: {generator_script}'})}\n\n"
                    return

                # Execute the generated code
                print(f"[DEBUG] Starting subprocess: {PYTHON_PATH} {generator_script}")
                print(f"[DEBUG] Code file: {code_file}")
                print(f"[DEBUG] Output file: {output_file}")

                process = subprocess.Popen(
                    [
                        PYTHON_PATH,
                        generator_script,
                        str(code_file),
                        output_file
                    ],
                    stdout=subprocess.PIPE,
                    stderr=subprocess.PIPE,
                    text=True,
                    cwd=script_dir,
                    bufsize=1,
                    universal_newlines=True
                )

                print(f"[DEBUG] Subprocess started with PID: {process.pid}")

                # Stream progress from stderr (where Manim writes progress)
                # Manim output format: " 50%|#####     | 15/30 [00:02<00:02,  6.53it/s]"
                while True:
                    # Check if process is still running
                    returncode = process.poll()
                    if returncode is not None:
                        print(f"[DEBUG] Process exited with code: {returncode}")
                        break

                    # Read line from stderr (non-blocking check)
                    try:
                        line = process.stderr.readline()
                    except Exception as e:
                        print(f"[DEBUG] Error reading from subprocess: {e}")
                        break

                    if line:
                        # Parse progress
                        if "%" in line:
                            try:
                                # Extract percentage
                                parts = line.split("%")
                                percentage = int(parts[0].strip().split()[-1])
                                yield f"data: {json.dumps({'type': 'progress', 'message': f'Rendering: {percentage}%', 'step': 1, 'totalSteps': 2, 'percentage': percentage})}\n\n"
                            except:
                                pass
                        elif "Error" in line or "Exception" in line:
                             yield f"data: {json.dumps({'type': 'log', 'message': line.strip()})}\n\n"

                # Get remaining output
                stdout, stderr = process.communicate()

                print(f"[DEBUG] Process completed with return code: {process.returncode}")
                print(f"[DEBUG] STDOUT: {stdout[:500] if stdout else 'None'}")
                print(f"[DEBUG] STDERR: {stderr[:500] if stderr else 'None'}")

                if process.returncode != 0:
                    # Exit code -9 means killed by OS (usually OOM)
                    if process.returncode == -9:
                        error_msg = "Rendering failed: Out of memory. Try a simpler problem or shorter explanation."
                        print(f"[ERROR] OOM Kill detected (exit code -9)")
                        yield f"data: {json.dumps({'type': 'error', 'error': error_msg, 'details': 'The visualization was too complex for available memory. Please try a simpler problem.'})}\n\n"
                    else:
                        error_msg = f"Subprocess failed with code {process.returncode}"
                        details = stderr if stderr else stdout
                        print(f"[ERROR] {error_msg}: {details}")
                        yield f"data: {json.dumps({'type': 'error', 'error': error_msg, 'details': details})}\n\n"
                    return

                # Clean up code file
                if code_file.exists():
                    code_file.unlink()

                # Find the generated video file
                video_path = None
                possible_paths = [
                    MEDIA_DIR / "videos" / "480p24" / f"{output_file}.mp4",
                    MEDIA_DIR / "videos" / "720p30" / f"{output_file}.mp4",
                    MEDIA_DIR / "videos" / "1080p60" / f"{output_file}.mp4",
                ]

                for path in possible_paths:
                    if path.exists():
                        video_path = path
                        break

                if not video_path:
                    media_contents = list(MEDIA_DIR.rglob("*.mp4"))
                    yield f"data: {json.dumps({'type': 'error', 'error': 'Video file not found', 'found_files': [str(p) for p in media_contents[:5]]})}\n\n"
                    return

                # Generate TTS and combine with video if narration is provided
                final_video_path = video_path
                has_audio = False
                
                if narration:
                    yield f"data: {json.dumps({'type': 'progress', 'message': 'Generating audio...', 'step': 2, 'totalSteps': 2})}\n\n"
                    print(f"[API] Generating TTS for narration...")
                    audio_path = MEDIA_DIR / f"{viz_id}_audio.wav"

                    # Generate TTS
                    if generate_tts(narration, audio_path):
                        # Combine video with audio
                        combined_path = MEDIA_DIR / f"{viz_id}_with_audio.mp4"
                        if combine_video_audio(video_path, audio_path, combined_path):
                            final_video_path = combined_path
                            has_audio = True
                            print(f"[API] Successfully added voice narration to video")
                        else:
                            print(f"[API] Failed to combine video and audio, using silent video")

                        # Clean up temporary audio file
                        if audio_path.exists():
                            audio_path.unlink()
                    else:
                        print(f"[API] Failed to generate TTS, using silent video")

                # Copy final video to public directory
                public_file = MEDIA_DIR / f"{viz_id}.mp4"
                shutil.copy(final_video_path, public_file)

                # Clean up temporary combined video if it was created
                if final_video_path != video_path and final_video_path.exists():
                    final_video_path.unlink()

                yield f"data: {json.dumps({'type': 'complete', 'success': True, 'video_id': viz_id, 'video_url': f'/video/{viz_id}', 'file_path': str(public_file), 'has_audio': has_audio})}\n\n"

            except Exception as e:
                yield f"data: {json.dumps({'type': 'error', 'error': 'Internal server error', 'details': str(e)})}\n\n"

        return Response(generate(), mimetype='text/event-stream')

    except Exception as e:
        return jsonify({
            "error": "Internal server error",
            "details": str(e)
        }), 500


@app.route('/generate', methods=['POST'])
def generate_visualization():
    """
    Generate a Manim visualization from problem data

    Request body:
    {
        "type": "equation|graph|geometry|number_line|function|generic",
        "content": "problem description",
        "equation": "x^2 + 2x + 1 = 0",  // for equation type
        "steps": ["step1", "step2"],      // for equation type
        "function": "x**2",               // for graph/function type
        "shapes": [...],                  // for geometry type
        "points": [...]                   // for number_line type
    }
    """
    try:
        problem_data = request.json

        # Generate unique ID for this visualization
        viz_id = str(uuid.uuid4())
        output_file = f"scene_{viz_id}"

        # Add output file to problem data
        problem_data['output_file'] = output_file

        # Convert problem data to JSON string
        problem_json = json.dumps(problem_data)

        # Run manim scene generator
        result = subprocess.run(
            [
                PYTHON_PATH,
                'scene_generator.py',
                problem_json
            ],
            capture_output=True,
            text=True,
            cwd=os.path.dirname(os.path.abspath(__file__))
        )

        if result.returncode != 0:
            return jsonify({
                "error": "Failed to generate visualization",
                "details": result.stderr
            }), 500

        # Find the generated video file
        video_path = MEDIA_DIR / "videos" / "1080p60" / f"{output_file}.mp4"

        # Alternative paths manim might use
        alt_paths = [
            MEDIA_DIR / "videos" / "scene_generator" / "1080p60" / f"{output_file}.mp4",
            MEDIA_DIR / "videos" / "scene_generator" / "720p30" / f"{output_file}.mp4",
            MEDIA_DIR / "videos" / "720p30" / f"{output_file}.mp4",
        ]

        # Check all possible paths
        found_path = None
        if video_path.exists():
            found_path = video_path
        else:
            for alt_path in alt_paths:
                if alt_path.exists():
                    found_path = alt_path
                    break

        if not found_path:
            # List what was actually created
            media_contents = list(MEDIA_DIR.rglob("*.mp4"))
            return jsonify({
                "error": "Video file not found",
                "expected": str(video_path),
                "found_files": [str(p) for p in media_contents]
            }), 500

        # Copy to public directory with consistent naming
        public_file = MEDIA_DIR / f"{viz_id}.mp4"
        shutil.copy(found_path, public_file)

        return jsonify({
            "success": True,
            "video_id": viz_id,
            "video_url": f"/video/{viz_id}",
            "file_path": str(public_file)
        })

    except Exception as e:
        return jsonify({
            "error": "Internal server error",
            "details": str(e)
        }), 500


@app.route('/video/<video_id>', methods=['GET'])
def get_video(video_id):
    """Serve a generated video file"""
    try:
        video_path = MEDIA_DIR / f"{video_id}.mp4"

        if not video_path.exists():
            return jsonify({"error": "Video not found"}), 404

        return send_file(video_path, mimetype='video/mp4')

    except Exception as e:
        return jsonify({
            "error": "Failed to retrieve video",
            "details": str(e)
        }), 500


@app.route('/cleanup', methods=['POST'])
def cleanup():
    """Clean up old video files"""
    try:
        # Remove all .mp4 files in media directory
        for video_file in MEDIA_DIR.glob("*.mp4"):
            video_file.unlink()

        return jsonify({"success": True, "message": "Cleanup completed"})

    except Exception as e:
        return jsonify({
            "error": "Cleanup failed",
            "details": str(e)
        }), 500


if __name__ == '__main__':
    # Use stat reloader instead of watchdog to avoid restarts when
    # media files are generated. Stat reloader only watches Python files.
    os.environ['WERKZEUG_RUN_MAIN'] = os.environ.get('WERKZEUG_RUN_MAIN', 'false')

    app.run(
        host='0.0.0.0',
        port=5001,
        debug=True,
        use_reloader=True,
        reloader_type='stat'  # Only watches Python files, not media files
    )
