"""
Text-to-Speech generation using QWEN TTS API
"""
import os
from pathlib import Path
import dashscope
from dashscope.audio.tts_v2 import SpeechSynthesizer


def generate_tts(text: str, output_path: Path, voice: str = "longxiaochun", speech_rate: int = 0) -> bool:
    """
    Generate TTS audio using QWEN's DashScope API

    Args:
        text: Text to convert to speech
        output_path: Path where audio file will be saved
        voice: Voice model to use (default: longxiaochun - female voice)
               Other options: longxiaochun, longwan, longyuan, longshuo, etc.
        speech_rate: Speech rate adjustment (-500 to 500, 0 is normal)
                    Negative = slower, Positive = faster

    Returns:
        bool: True if successful, False otherwise
    """
    try:
        # Get API key from environment
        api_key = os.getenv('QWEN_API_KEY')
        
        # Try Qwen TTS if API key is present
        if api_key:
            try:
                print(f"[TTS] Attempting Qwen TTS for text: {text[:50]}...")
                dashscope.api_key = api_key
                synthesizer = SpeechSynthesizer(model='cosyvoice-v1', voice=voice)
                audio_data = synthesizer.call(text)
                if audio_data:
                    with open(output_path, 'wb') as f:
                        f.write(audio_data)
                    print(f"[TTS] Qwen TTS success. Audio saved to {output_path}")
                    return True
            except Exception as e:
                print(f"[TTS] Qwen TTS failed: {str(e)}")
                print("[TTS] Falling back to gTTS...")
        else:
            print("[TTS] QWEN_API_KEY not found. Using gTTS fallback...")

        # Fallback to gTTS
        try:
            from gtts import gTTS
            print(f"[TTS] Generating audio with gTTS for text: {text[:50]}...")
            tts = gTTS(text=text, lang='en', slow=False)
            tts.save(str(output_path))
            print(f"[TTS] gTTS success. Audio saved to {output_path}")
            return True
        except Exception as e:
            print(f"[TTS] gTTS failed: {str(e)}")
            return False

    except Exception as e:
        print(f"[TTS] Error generating TTS: {str(e)}")
        import traceback
        traceback.print_exc()
        return False


def combine_video_audio(video_path: Path, audio_path: Path, output_path: Path) -> bool:
    """
    Combine video and audio using moviepy, ensuring proper sync

    Args:
        video_path: Path to the video file
        audio_path: Path to the audio file
        output_path: Path where combined video will be saved

    Returns:
        bool: True if successful, False otherwise
    """
    try:
        from moviepy.editor import VideoFileClip, AudioFileClip, CompositeAudioClip

        print(f"[TTS] Combining video {video_path} with audio {audio_path}...")

        # Load video and audio
        video = VideoFileClip(str(video_path))
        audio = AudioFileClip(str(audio_path))

        print(f"[TTS] Video duration: {video.duration:.2f}s, Audio duration: {audio.duration:.2f}s")

        # Strategy: If audio is longer than video, extend video's last frame
        # If video is longer than audio, keep video as is (silent after audio)
        final_video = video
        final_audio = audio

        if audio.duration > video.duration:
            # Audio is longer - we need to extend the video or trim audio
            # For now, trim audio to match video to avoid extending video
            print(f"[TTS] Audio longer than video, trimming audio to {video.duration:.2f}s")
            final_audio = audio.subclip(0, video.duration)
        elif video.duration > audio.duration + 1:
            # Video is significantly longer - this is OK, video will be silent at end
            print(f"[TTS] Video is {video.duration - audio.duration:.2f}s longer than audio")

        # Set audio to video
        video_with_audio = final_video.set_audio(final_audio)

        # Write output with good quality settings
        video_with_audio.write_videofile(
            str(output_path),
            codec='libx264',
            audio_codec='aac',
            temp_audiofile='temp-audio.m4a',
            remove_temp=True,
            fps=video.fps,
            preset='medium',
            bitrate='5000k',  # Higher quality video
            audio_bitrate='192k',  # Good quality audio
            logger=None  # Suppress moviepy logging
        )

        # Clean up
        video.close()
        audio.close()
        final_audio.close()
        video_with_audio.close()

        print(f"[TTS] Combined video saved to {output_path}")
        return True

    except Exception as e:
        print(f"[TTS] Error combining video and audio: {str(e)}")
        import traceback
        traceback.print_exc()
        return False
