"""
Dynamic Manim Scene Generator
Executes AI-generated Manim code to create visualizations
"""
from manim import *
import json
import sys
import os
import traceback


def execute_generated_code(code: str, output_file: str):
    """
    Safely execute AI-generated Manim code

    Args:
        code: Python code containing a GeneratedScene class
        output_file: Output filename for the rendered video
    """
    try:
        # Set up Manim configuration (optimized for low memory environments)
        # Using 480p @ 24fps to reduce memory consumption in Railway
        config.pixel_height = 480
        config.pixel_width = 854
        config.frame_rate = 24
        config.output_file = output_file
        config.media_dir = "./media"

        # Memory optimization settings
        config.write_to_movie = True
        config.save_last_frame = False  # Don't save extra frames
        config.preview = False  # Disable preview
        config.write_all = False  # Only write the final video

        # Create a restricted global namespace for code execution
        # Start with standard builtins but remove dangerous functions
        import builtins
        safe_builtins = {
            name: getattr(builtins, name)
            for name in dir(builtins)
        }

        # Remove dangerous built-in functions
        dangerous_builtins = ['eval', 'exec', 'compile', '__import__',
                              'open', 'input', 'breakpoint', 'exit', 'quit',
                              'help', 'copyright', 'credits', 'license']
        for name in dangerous_builtins:
            safe_builtins.pop(name, None)

        # Create safe namespace with Manim objects pre-populated
        safe_globals = {
            '__builtins__': safe_builtins,
            'np': np,  # NumPy for math operations
            'config': config,
            # Import all Manim objects into the namespace
            **{name: getattr(sys.modules['manim'], name)
               for name in dir(sys.modules['manim'])
               if not name.startswith('_')},
        }

        # Remove import statements from code since objects are already available
        # This prevents __import__ errors
        code_lines = code.split('\n')
        filtered_lines = []
        for line in code_lines:
            # Skip import lines
            if line.strip().startswith('from manim import') or \
               line.strip().startswith('import manim') or \
               line.strip().startswith('import numpy as np') or \
               line.strip() == 'import numpy':
                continue
            filtered_lines.append(line)

        cleaned_code = '\n'.join(filtered_lines)

        # Execute the cleaned code in the safe namespace
        exec(cleaned_code, safe_globals)

        # Get the GeneratedScene class
        if 'GeneratedScene' not in safe_globals:
            raise ValueError("Generated code must define a 'GeneratedScene' class")

        GeneratedScene = safe_globals['GeneratedScene']

        # Create and render the scene
        scene = GeneratedScene()
        scene.render()

        print(f"✅ Successfully rendered scene to {output_file}")
        return True

    except Exception as e:
        print(f"❌ Error executing generated code: {e}")
        traceback.print_exc()
        raise


if __name__ == "__main__":
    if len(sys.argv) < 3:
        print("Usage: python dynamic_scene_generator.py <code_file> <output_file>")
        sys.exit(1)

    code_file = sys.argv[1]
    output_file = sys.argv[2]

    # Read the generated code
    with open(code_file, 'r') as f:
        code = f.read()

    # Execute it
    execute_generated_code(code, output_file)
