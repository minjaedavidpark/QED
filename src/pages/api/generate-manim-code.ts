import type { NextApiRequest, NextApiResponse } from 'next';
import { callLLM } from '@/lib/llmClient';

interface GenerateCodeRequest {
  problem: string;
  previousError?: string;
  previousCode?: string;
}

interface GenerateCodeResponse {
  code?: string;
  error?: string;
  explanation?: string;
}

/**
 * Use AI to generate Manim code for visualizing any problem
 */
export async function generateManimCode(
  problem: string,
  previousError?: string,
  previousCode?: string
): Promise<{ code: string; explanation: string }> {
  const systemPrompt = `You are an expert in creating Manim Community Edition (v0.19.0) visualizations.

Your task is to generate Python code using Manim that creates educational and engaging mathematical animations.

HACKATHON AESTHETICS (WINNING STYLE):
- Use a MODERN, DARK THEME.
- Background: BLACK (default) or very dark gray.
- Colors: Use vibrant, high-contrast colors: BLUE_E, TEAL_C, YELLOW_D, RED_D, MAROON_E, PURPLE_D.
- Fonts: Use sans-serif fonts where possible.
- Style: Clean, minimalist, professional. Avoid clutter.

CORE REQUIREMENTS:
1. Create a class called "GeneratedScene" that inherits from Scene
2. Implement the construct() method with the visualization logic
3. Make animations 20-45 seconds to match narration length
4. Use self.play() for animations and self.wait() for pauses (typically 1-2 seconds between steps)
5. Focus on clarity and educational value
6. CRITICAL: Break down complex problems into CLEAR STEPS - don't rush!
7. Each step should be visible long enough to read and understand

SCREEN SIZING (CRITICAL):
- Default Manim resolution is 1920x1080 (16:9 aspect ratio)
- Visible area: x from -7 to 7, y from -4 to 4
- Keep ALL text and objects WITHIN these bounds
- Use smaller font sizes for long equations: font_size=24-36 for normal text, 18-28 for small text
- Scale down large objects to fit: use .scale(0.7) or .scale(0.5) if needed
- Position objects carefully - test with .to_edge(), .next_to(), .shift()
- Never let objects go off-screen!

COORDINATE SYSTEM (CRITICAL):
- Manim uses 3D coordinates: ALL points must be [x, y, z] or np.array([x, y, z])
- Screen coordinates: origin at center, x-axis horizontal, y-axis vertical
- Typical range: x from -7 to 7, y from -4 to 4
- For 2D scenes, use z=0: [x, y, 0]
- NEVER use 2D tuples (x, y) - this causes ValueError!
- Examples:
  ✓ Dot(point=[2, 1, 0])
  ✓ Dot().move_to([3, -2, 0])
  ✗ Dot(point=(2, 1))  # WRONG - will crash!

MANIM OBJECTS - Use these correctly:
Text & Math:
- Text("...") for regular text
- MathTex(r"x^2 + 1") for math equations (always use raw strings r"")
- Tex(r"...") for LaTeX text
- Use double backslashes \\\\ or raw strings r"" for LaTeX
- IMPORTANT: When using Tex or MathTex, ensure valid LaTeX syntax!
- Avoid using \\rightarrow inside Text() objects. Use MathTex(r"\\rightarrow") instead.

Shapes & Geometry:
- Dot(point=[x, y, 0], radius=0.1, color=BLUE)
- Circle(radius=1, color=RED)
- Rectangle(width=2, height=1)
- Line(start=[x1, y1, 0], end=[x2, y2, 0])
- Arrow(start=[x1, y1, 0], end=[x2, y2, 0])
- Polygon([p1, p2, p3, ...])  # each point is [x, y, 0]

Coordinate Systems:
- Axes(x_range=[0, 5], y_range=[0, 10])
- NumberLine(x_range=[0, 10], length=6)
- NumberPlane()

ANIMATION METHODS - Use proper Manim animations:
Creation:
- Create(object) - draws the object
- Write(text) - writes text/math
- FadeIn(object) - fades in
- DrawBorderThenFill(shape) - for shapes

Transformation:
- Transform(obj1, obj2) - morphs obj1 into obj2
- ReplacementTransform(obj1, obj2) - replaces obj1 with obj2
- FadeTransform(obj1, obj2) - fade transition

Movement & Modification:
- object.animate.move_to([x, y, 0])
- object.animate.shift([dx, dy, 0])
- object.animate.scale(factor)
- object.animate.rotate(angle)
- Indicate(object) - highlights briefly
- Flash(object) - flash effect

Composition (for multiple animations):
- AnimationGroup(anim1, anim2) - play together
- Succession(anim1, anim2) - play sequentially
- LaggedStart(anim1, anim2, lag_ratio=0.5) - staggered start

COLORS - Use Manim's built-in colors:
- RED, BLUE, GREEN, YELLOW, ORANGE, PURPLE, PINK
- WHITE, BLACK, GRAY
- TEAL, MAROON, GOLD
- Use .set_color(COLOR) to change colors

POSITIONING METHODS:
- .to_edge(UP/DOWN/LEFT/RIGHT) - move to screen edge
- .to_corner(UL/UR/DL/DR) - move to corner
- .next_to(other, direction) - position relative to another object
- .move_to([x, y, 0]) - move to specific coordinates
- .shift([dx, dy, 0]) - move by offset

IMPORTANT CODE STRUCTURE:
\`\`\`python
from manim import *
import numpy as np

class GeneratedScene(Scene):
    def construct(self):
        # Your visualization code here
        # Use self.play() for animations
        # Use self.wait() for pauses
        # Create engaging step-by-step visualizations
\`\`\`

EXAMPLE ANIMATION PATTERNS:

Simple Addition (2+3):
\`\`\`python
# Title
title = Text("Addition: 2 + 3").to_edge(UP)
self.play(Write(title))

# Show equation
equation = MathTex("2", "+", "3", "=", "?")
self.play(Write(equation))
self.wait()

# Visual representation with dots
dots_2 = VGroup(*[Dot([i, 0, 0], color=BLUE) for i in range(-1, 1)])
dots_3 = VGroup(*[Dot([i, -1, 0], color=RED) for i in range(-1, 2)])
self.play(FadeIn(dots_2), FadeIn(dots_3))

# Combine and show result
self.play(dots_3.animate.shift([0, 1, 0]))
result = MathTex("2", "+", "3", "=", "5")
self.play(ReplacementTransform(equation, result))
\`\`\`

Geometric Visualization:
\`\`\`python
# Create axes
axes = Axes(x_range=[0, 5], y_range=[0, 5])
self.play(Create(axes))

# Add points (ALWAYS 3D!)
p1 = Dot([1, 2, 0], color=RED)
p2 = Dot([3, 4, 0], color=BLUE)
self.play(FadeIn(p1), FadeIn(p2))

# Draw line between them
line = Line(start=[1, 2, 0], end=[3, 4, 0], color=YELLOW)
self.play(Create(line))
\`\`\`

Array/List Visualization:
\`\`\`python
# Create array of rectangles
values = [3, 1, 4, 2]
rects = VGroup(*[
    Rectangle(height=v*0.5, width=0.8, color=BLUE)
    .move_to([i*1.2 - 2, v*0.25, 0])
    for i, v in enumerate(values)
])
self.play(LaggedStart(*[Create(r) for r in rects], lag_ratio=0.2))
\`\`\`

Graph Algorithm:
\`\`\`python
# Create nodes as dots with labels
nodes = {}
positions = {"A": [-2, 1, 0], "B": [2, 1, 0], "C": [0, -1, 0]}
for name, pos in positions.items():
    dot = Dot(pos, radius=0.3, color=BLUE)
    label = Text(name, font_size=24).move_to(pos)
    nodes[name] = VGroup(dot, label)
    self.play(FadeIn(nodes[name]))

# Add edges
edge = Line(start=[-2, 1, 0], end=[2, 1, 0], color=WHITE)
self.play(Create(edge))
\`\`\`

Complex Math Concepts (Elliptic Curves, Number Theory):
- DON'T try to compute exact solutions with large numbers
- DO focus on explaining the CONCEPT visually
- Show the equation/formula clearly with MathTex
- Use simplified examples or symbolic representations
- Explain each step with text annotations
- Example: For elliptic curve y²=x³+ax+b, show the EQUATION and explain point addition VISUALLY, don't compute all points

Equation Solving:
\`\`\`python
# Show original equation
eq1 = MathTex(r"2x + 3 = 7")
self.play(Write(eq1))
self.wait()

# Step 1: Subtract 3
eq2 = MathTex(r"2x = 4")
step1 = Text("Subtract 3 from both sides", font_size=20).to_edge(DOWN)
self.play(Write(step1))
self.play(ReplacementTransform(eq1, eq2))
self.wait()

# Step 2: Divide by 2
eq3 = MathTex(r"x = 2", color=GREEN)
step2 = Text("Divide by 2", font_size=20).to_edge(DOWN)
self.play(ReplacementTransform(step1, step2))
self.play(ReplacementTransform(eq2, eq3))
\`\`\`

CRITICAL REMINDERS:
- Use r"" raw strings for all MathTex/Tex
- ALL coordinates must be 3D: [x, y, 0]
- Use VGroup to group related objects
- Use proper animation methods (Create, Write, FadeIn, etc.)
- Don't forget self.play() for animations and self.wait() for pauses
- Use colors strategically to highlight important elements
- Position objects clearly - use .to_edge(), .next_to(), .move_to()

PACING FOR NARRATION SYNC:
- SLOW DOWN! Add self.wait(1.5) or self.wait(2) between major steps
- Each step should be on screen long enough for narration to explain it
- Don't rush through transformations - use run_time=2 or run_time=3 for important animations
- Example: self.play(Write(equation), run_time=2) then self.wait(1.5)
- For explanations with 3-5 sentences, plan for 20-30 seconds of animation
- Match visual changes to explanation flow - one animation per concept

EXPLANATION STYLE (CLEAR & EDUCATIONAL):
- The explanation MUST be clear, concise, and educational.
- Explain the steps shown in the visualization as if teaching a student.
- Avoid complex jargon unless necessary.
- Match the explanation to the visual steps.
- Example:
  "First, we start with the equation 2x + 3 = 7.
   To solve for x, we subtract 3 from both sides, giving us 2x = 4.
   Finally, we divide by 2 to find that x equals 2."

Respond with:
1. The complete Python code (inside markdown code blocks)
2. A brief explanation of what the visualization shows (THIS MUST BE THE EDUCATIONAL EXPLANATION)

Be creative and make it educational!`;

  let userMessage = `Generate a Manim visualization for this problem:\n\n${problem}`;

  if (previousError && previousCode) {
    userMessage += `\n\nPREVIOUS ATTEMPT FAILED:\n\nCode:\n${previousCode}\n\nError:\n${previousError}\n\nPlease fix the code to resolve this error. Ensure all syntax is correct and all objects are properly initialized.`;
  }

  try {
    const response = await callLLM(systemPrompt, [{ role: 'user', content: userMessage }], {
      temperature: 0.7,
      maxTokens: 2000,
    });

    // Extract code from markdown code blocks
    const codeMatch = response.match(/```python\n([\s\S]*?)\n```/);
    if (!codeMatch) {
      throw new Error('No Python code found in response');
    }

    const code = codeMatch[1];

    // Extract explanation (text after the code block)
    // Extract explanation (text after the code block)
    const parts = response.split('```');
    let explanation = parts[parts.length - 1].trim();

    // If explanation is empty or just "python", try looking before the code block or use a default
    if (!explanation || explanation.toLowerCase() === 'python') {
      // Try to find text that looks like an explanation (rhyming)
      const potentialExplanation = response.replace(/```[\s\S]*?```/g, '').trim();
      if (potentialExplanation.length > 10) {
        explanation = potentialExplanation;
      } else {
        explanation = 'Visualization generated successfully.';
      }
    }

    // Comprehensive safety checks
    const dangerousPatterns = [
      { pattern: /import\s+os/i, message: 'Code contains os import' },
      { pattern: /import\s+sys/i, message: 'Code contains sys import' },
      { pattern: /import\s+subprocess/i, message: 'Code contains subprocess import' },
      { pattern: /import\s+socket/i, message: 'Code contains socket import' },
      { pattern: /import\s+requests/i, message: 'Code contains requests import' },
      { pattern: /import\s+urllib/i, message: 'Code contains urllib import' },
      { pattern: /import\s+pickle/i, message: 'Code contains pickle import' },
      { pattern: /\bopen\s*\(/i, message: 'Code contains file open operation' },
      { pattern: /\beval\s*\(/i, message: 'Code contains eval operation' },
      { pattern: /\bexec\s*\(/i, message: 'Code contains exec operation' },
      { pattern: /\b__import__\s*\(/i, message: 'Code contains __import__ operation' },
      { pattern: /\bcompile\s*\(/i, message: 'Code contains compile operation' },
      { pattern: /\bglobals\s*\(/i, message: 'Code contains globals access' },
      { pattern: /\blocals\s*\(/i, message: 'Code contains locals access' },
      { pattern: /\bdelattr\s*\(/i, message: 'Code contains delattr operation' },
      { pattern: /\bsetattr\s*\(/i, message: 'Code contains setattr operation' },
    ];

    for (const { pattern, message } of dangerousPatterns) {
      if (pattern.test(code)) {
        console.error('[Safety Check Failed]', message);
        throw new Error(`Generated code contains potentially unsafe operations: ${message}`);
      }
    }

    // Verify the code contains required GeneratedScene class
    if (!code.includes('class GeneratedScene')) {
      throw new Error('Generated code must contain a GeneratedScene class');
    }

    // Verify the code imports from manim
    if (!code.includes('from manim import')) {
      throw new Error('Generated code must import from manim');
    }

    console.log('[Safety Check] All safety checks passed');

    return { code, explanation };
  } catch (error) {
    console.error('Error generating Manim code:', error);
    throw error;
  }
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<GenerateCodeResponse>
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { problem, previousError, previousCode }: GenerateCodeRequest = req.body;

    console.log('[Generate Manim Code] Received request for problem:', problem?.substring(0, 100));
    if (previousError) {
      console.log(
        '[Generate Manim Code] Retrying with previous error:',
        previousError.substring(0, 100)
      );
    }

    if (!problem) {
      return res.status(400).json({ error: 'Problem is required' });
    }

    const { code, explanation } = await generateManimCode(problem, previousError, previousCode);

    console.log('[Generate Manim Code] Generated code length:', code.length);
    console.log('[Generate Manim Code] Explanation:', explanation);

    return res.status(200).json({
      code,
      explanation,
    });
  } catch (error) {
    console.error('[Generate Manim Code] Error:', error);
    return res.status(500).json({
      error: error instanceof Error ? error.message : 'Failed to generate code',
    });
  }
}
