#!/usr/bin/env python3
"""
Test script for dynamic visualization endpoint (/generate-dynamic)
"""
import requests
import json
import sys
import time

MANIM_SERVICE_URL = "http://localhost:5001"

def test_dynamic_generation():
    """Test dynamic generation with narration (expecting TTS failure but video success)"""
    print("=" * 60)
    print("Testing Dynamic Visualization Endpoint")
    print("=" * 60)

    # Simple Manim code for testing
    code = """
from manim import *

class GeneratedScene(Scene):
    def construct(self):
        c = Circle(color=BLUE)
        self.play(Create(c))
        self.wait(1)
"""

    payload = {
        "code": code,
        "narration": "This is a test narration. It might fail if API key is missing, but video should still work."
    }

    print("1. Sending request to /generate-dynamic...")
    start_time = time.time()
    
    try:
        response = requests.post(
            f"{MANIM_SERVICE_URL}/generate-dynamic",
            json=payload,
            timeout=120
        )
        
        duration = time.time() - start_time
        print(f"   ⏱️  Request took {duration:.2f} seconds")

        if response.status_code == 200:
            result = response.json()
            print(f"   ✅ Success!")
            print(f"   Video ID: {result.get('video_id')}")
            print(f"   Video URL: {result.get('video_url')}")
            print(f"   Has Audio: {result.get('has_audio')}")
            
            if not result.get('has_audio'):
                print("   ℹ️  Note: No audio generated (expected if API key is invalid)")
            
            return True
        else:
            print(f"   ❌ Failed with status {response.status_code}")
            print(f"   Error: {response.text}")
            return False

    except Exception as e:
        print(f"   ❌ Error: {e}")
        return False

if __name__ == "__main__":
    if test_dynamic_generation():
        sys.exit(0)
    else:
        sys.exit(1)
