"""
Manim Scene Generator for QED
Generates mathematical visualizations based on problem descriptions
"""
from manim import *
import json
import sys
import os


class MathProblemScene(Scene):
    """Base class for mathematical problem visualizations"""

    def __init__(self, problem_data=None, **kwargs):
        super().__init__(**kwargs)
        self.problem_data = problem_data or {}

    def construct(self):
        # Extract problem details
        problem_type = self.problem_data.get('type', 'generic')
        content = self.problem_data.get('content', '')

        # Route to appropriate visualization method
        if problem_type == 'equation':
            self.visualize_equation()
        elif problem_type == 'graph':
            self.visualize_graph()
        elif problem_type == 'geometry':
            self.visualize_geometry()
        elif problem_type == 'number_line':
            self.visualize_number_line()
        elif problem_type == 'function':
            self.visualize_function()
        else:
            self.visualize_generic()

    def visualize_equation(self):
        """Visualize an equation"""
        equation_text = self.problem_data.get('equation', 'x + y = z')
        steps = self.problem_data.get('steps', [])

        # Title
        title = Text("Solving the Equation", font_size=36)
        title.to_edge(UP)
        self.play(Write(title))
        self.wait(0.5)

        # Display equation
        equation = MathTex(equation_text, font_size=48)
        self.play(Write(equation))
        self.wait(1)

        # Animate steps if provided
        if steps:
            for i, step in enumerate(steps):
                new_equation = MathTex(step, font_size=48)
                self.play(Transform(equation, new_equation))
                self.wait(1)

        self.wait(1)

    def visualize_graph(self):
        """Visualize a graph or plot"""
        # Create axes
        axes = Axes(
            x_range=[-10, 10, 1],
            y_range=[-10, 10, 1],
            x_length=7,
            y_length=7,
            axis_config={"include_tip": True, "numbers_to_include": np.arange(-10, 11, 2)},
        )

        # Get function from problem data
        func_expr = self.problem_data.get('function', 'x**2')

        # Create graph
        try:
            graph = axes.plot(lambda x: eval(func_expr.replace('x', str(x))), color=BLUE)
            graph_label = axes.get_graph_label(graph, label=f'y = {func_expr}')

            # Animate
            self.play(Create(axes))
            self.wait(0.5)
            self.play(Create(graph), Write(graph_label))
            self.wait(2)
        except:
            # Fallback to simple parabola
            graph = axes.plot(lambda x: x**2, color=BLUE)
            graph_label = axes.get_graph_label(graph, label='y = x^2')
            self.play(Create(axes), Create(graph), Write(graph_label))
            self.wait(2)

    def visualize_geometry(self):
        """Visualize geometric shapes and concepts"""
        shapes_data = self.problem_data.get('shapes', [])

        if not shapes_data:
            # Default: show basic geometric shapes
            circle = Circle(radius=1, color=BLUE)
            square = Square(side_length=2, color=RED).shift(RIGHT * 3)
            triangle = Triangle(color=GREEN).shift(LEFT * 3)

            self.play(Create(circle), Create(square), Create(triangle))
            self.wait(2)
        else:
            # Create shapes from data
            for shape_data in shapes_data:
                shape_type = shape_data.get('type', 'circle')
                if shape_type == 'circle':
                    shape = Circle(radius=shape_data.get('radius', 1))
                elif shape_type == 'square':
                    shape = Square(side_length=shape_data.get('side', 2))
                elif shape_type == 'triangle':
                    shape = Triangle()

                self.play(Create(shape))
                self.wait(0.5)

    def visualize_number_line(self):
        """Visualize concepts on a number line"""
        start = self.problem_data.get('start', -5)
        end = self.problem_data.get('end', 5)
        points = self.problem_data.get('points', [])

        # Create number line
        number_line = NumberLine(
            x_range=[start, end, 1],
            length=10,
            include_numbers=True,
            label_direction=DOWN,
        )

        self.play(Create(number_line))
        self.wait(0.5)

        # Add points
        for point_data in points:
            value = point_data.get('value', 0)
            label = point_data.get('label', str(value))

            dot = Dot(number_line.n2p(value), color=RED)
            text = Text(label, font_size=24).next_to(dot, UP)

            self.play(Create(dot), Write(text))
            self.wait(0.5)

        self.wait(1)

    def visualize_function(self):
        """Visualize function transformations"""
        axes = Axes(
            x_range=[-5, 5, 1],
            y_range=[-5, 5, 1],
            x_length=7,
            y_length=7,
        )

        labels = axes.get_axis_labels(x_label="x", y_label="y")

        # Base function
        func1 = axes.plot(lambda x: x**2, color=BLUE)
        func1_label = MathTex("f(x) = x^2", color=BLUE).to_edge(UP)

        self.play(Create(axes), Write(labels))
        self.play(Create(func1), Write(func1_label))
        self.wait(2)

    def visualize_generic(self):
        """Generic visualization with text"""
        content = self.problem_data.get('content', 'Problem Visualization')

        # Title
        title = Text("Problem Breakdown", font_size=40)
        title.to_edge(UP)

        # Content
        content_text = Text(content[:200], font_size=24).scale(0.8)
        content_text.next_to(title, DOWN, buff=0.5)

        self.play(Write(title))
        self.wait(0.5)
        self.play(Write(content_text))
        self.wait(2)


def generate_scene(problem_data, output_file):
    """
    Generate a Manim scene from problem data

    Args:
        problem_data: Dictionary containing problem information
        output_file: Output filename (without extension)
    """
    config.pixel_height = 720
    config.pixel_width = 1280
    config.frame_rate = 30
    config.output_file = output_file

    scene = MathProblemScene(problem_data=problem_data)
    scene.render()


if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python scene_generator.py <problem_json>")
        sys.exit(1)

    # Parse problem data from JSON
    problem_json = sys.argv[1]
    problem_data = json.loads(problem_json)

    # Generate unique output filename
    output_file = problem_data.get('output_file', 'scene')

    # Set output directory
    config.media_dir = "./media"

    # Generate the scene
    generate_scene(problem_data, output_file)

    print(f"Scene generated successfully: {output_file}")
