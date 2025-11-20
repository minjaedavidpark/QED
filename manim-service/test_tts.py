#!/usr/bin/env python3
"""
Test script for TTS functionality
"""
import os
from pathlib import Path
from dotenv import load_dotenv
from tts_generator import generate_tts

# Load environment
parent_env = Path(__file__).parent.parent / '.env.local'
if parent_env.exists():
    load_dotenv(parent_env)

def test_tts():
    """Test TTS generation"""
    print("=" * 60)
    print("Testing QWEN TTS Integration")
    print("=" * 60)

    # Check API key
    api_key = os.getenv('QWEN_API_KEY')
    if not api_key:
        print("❌ ERROR: QWEN_API_KEY not found in environment")
        return False

    print(f"✅ API Key loaded: {api_key[:10]}...{api_key[-5:]}")

    # Test text
    test_text = """
    This is a test of the text-to-speech system.
    We are demonstrating how mathematical visualizations can be narrated with AI-generated voice.
    The addition of two plus three equals five is a simple example.
    This narration should sync with the visual animation perfectly.
    """

    print(f"\n📝 Test text length: {len(test_text)} characters")
    print(f"📝 Text preview: {test_text[:100]}...")

    # Generate TTS
    output_path = Path("./media/test_tts.wav")
    output_path.parent.mkdir(exist_ok=True)

    print(f"\n🎙️  Generating TTS audio...")
    success = generate_tts(test_text, output_path)

    if success and output_path.exists():
        file_size = output_path.stat().st_size
        print(f"\n✅ SUCCESS! Audio generated")
        print(f"📁 File: {output_path}")
        print(f"📊 Size: {file_size / 1024:.2f} KB")

        # Try to get duration using moviepy
        try:
            from moviepy.editor import AudioFileClip
            audio = AudioFileClip(str(output_path))
            duration = audio.duration
            audio.close()
            print(f"⏱️  Duration: {duration:.2f} seconds")

            # Estimate words per second
            words = len(test_text.split())
            wps = words / duration if duration > 0 else 0
            print(f"📈 Speech rate: {wps:.1f} words/second")

        except Exception as e:
            print(f"⚠️  Could not determine duration: {e}")

        print(f"\n🎵 Test audio saved. You can play it with:")
        print(f"   afplay {output_path}  (on macOS)")
        print(f"   or open it in any audio player")

        return True
    else:
        print(f"\n❌ FAILED to generate TTS")
        return False

if __name__ == "__main__":
    test_tts()
