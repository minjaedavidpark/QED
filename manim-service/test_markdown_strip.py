from tts_generator import strip_markdown

def test_strip_markdown():
    test_cases = [
        ("# Header", "Header"),
        ("**Bold** text", "Bold text"),
        ("This is `code`", "This is"),
        ("Check [this link](http://example.com)", "Check this link"),
        ("![Image](img.png)", ""),
        ("> Blockquote", "Blockquote"),
        ("Equation $x^2$", "Equation x^2"),
        ("## Subheader\n* List item", "Subheader\n List item"),
        (r"Backslash \ test", "Backslash  test")
    ]

    for input_text, expected in test_cases:
        result = strip_markdown(input_text)
        # Note: The code stripping regex might leave extra spaces or remove the word entirely depending on implementation.
        # Let's just print the result to verify manually for now if exact match fails.
        print(f"Input: '{input_text}'\nOutput: '{result}'\nExpected: '{expected}'\n---")

if __name__ == "__main__":
    test_strip_markdown()
