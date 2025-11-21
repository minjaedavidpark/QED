import os
from pathlib import Path
from moviepy.editor import ColorClip, AudioFileClip, CompositeVideoClip, concatenate_videoclips
import numpy as np
from scipy.io import wavfile

def create_dummy_assets():
    # Create a 2-second video
    video = ColorClip(size=(640, 480), color=(255, 0, 0), duration=2.0)
    video.fps = 24
    video.write_videofile("dummy_video.mp4", logger=None)
    
    # Create a 4-second audio
    sample_rate = 44100
    duration = 4.0
    t = np.linspace(0, duration, int(sample_rate * duration), endpoint=False)
    audio_data = 0.5 * np.sin(2 * np.pi * 440 * t)
    wavfile.write("dummy_audio.wav", sample_rate, (audio_data * 32767).astype(np.int16))
    
    return Path("dummy_video.mp4"), Path("dummy_audio.wav")

def test_combine_logic():
    video_path, audio_path = create_dummy_assets()
    output_path = Path("dummy_output.mp4")
    
    try:
        print(f"Testing combination logic...")
        from moviepy.editor import VideoFileClip, AudioFileClip, concatenate_videoclips
        
        video = VideoFileClip(str(video_path))
        audio = AudioFileClip(str(audio_path))
        
        print(f"Video duration: {video.duration}")
        print(f"Audio duration: {audio.duration}")
        
        final_video = video
        final_audio = audio
        
        if audio.duration > video.duration:
            duration_diff = audio.duration - video.duration
            print(f"Audio is {duration_diff:.2f}s longer. Extending...")
            
            # This is the logic I added
            last_frame = video.to_ImageClip(t=video.duration - 0.01, duration=duration_diff)
            final_video = concatenate_videoclips([video, last_frame])
            
        video_with_audio = final_video.set_audio(final_audio)
        video_with_audio.write_videofile(str(output_path), fps=24, logger=None)
        
        print("Success!")
        
    except Exception as e:
        print(f"FAILED: {e}")
        import traceback
        traceback.print_exc()
    finally:
        # Cleanup
        if video_path.exists(): video_path.unlink()
        if audio_path.exists(): audio_path.unlink()
        if output_path.exists(): output_path.unlink()

if __name__ == "__main__":
    test_combine_logic()
