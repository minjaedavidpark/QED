import { useState } from 'react';

interface VisualizationPanelProps {
  problem: string;
  image?: string;
  onVisualize?: () => void;
}

export default function VisualizationPanel({
  problem,
  image,
  onVisualize,
}: VisualizationPanelProps) {
  const [loading, setLoading] = useState(false);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [progressMessage, setProgressMessage] = useState<string | null>(null);
  const [progressPercentage, setProgressPercentage] = useState<number>(0);

  const readStream = async (response: Response, onComplete: (data: any) => void) => {
    const reader = response.body?.getReader();
    const decoder = new TextDecoder();

    if (!reader) {
      throw new Error('Failed to initialize stream reader');
    }

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      const chunk = decoder.decode(value);
      const lines = chunk.split('\n\n');

      for (const line of lines) {
        if (line.startsWith('data: ')) {
          try {
            const data = JSON.parse(line.slice(6));

            if (data.type === 'progress') {
              setProgressMessage(data.message);
              if (data.totalSteps) {
                setProgressPercentage(Math.round((data.step / data.totalSteps) * 100));
              }
            } else if (data.type === 'complete') {
              onComplete(data);
            } else if (data.type === 'error') {
              throw new Error(data.error || 'An error occurred');
            }
          } catch (e) {
            console.error('Error parsing SSE data:', e);
          }
        }
      }
    }
  };

  const generateVisualization = async () => {
    if ((!problem || problem.trim().length === 0) && !image) {
      console.error('[VisualizationPanel] No problem or image provided');
      setError('Please provide a problem or image first');
      return;
    }

    console.log('[VisualizationPanel] Starting visualization generation');
    console.log('[VisualizationPanel] Problem:', problem.substring(0, 100));
    if (image) console.log('[VisualizationPanel] Image provided');

    setLoading(true);
    setError(null);
    setVideoUrl(null);
    setProgressMessage('Initializing...');
    setProgressPercentage(0);

    if (onVisualize) {
      onVisualize();
    }

    try {
      console.log('[VisualizationPanel] Calling /api/visualize');
      const response = await fetch('/api/visualize', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ problem, image }),
      });

      console.log('[VisualizationPanel] Response status:', response.status);

      if (!response.ok) {
        // Try to parse error from JSON if possible, though it might be streamed
        try {
          const data = await response.json();
          throw new Error(data.details || data.error || 'Failed to generate visualization');
        } catch (e) {
          throw new Error(`Server error (${response.status}): ${response.statusText}`);
        }
      }

      await readStream(response, (data) => {
        console.log('[VisualizationPanel] Success! Video URL:', data.videoUrl);
        setVideoUrl(data.videoUrl);
      });
    } catch (err) {
      console.error('[VisualizationPanel] Exception:', err);
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
      setProgressMessage(null);
      setProgressPercentage(0);
    }
  };

  return (
    <div className="mt-6 p-6 bg-gradient-to-br from-purple-50 via-white to-blue-50 dark:from-gray-800 dark:via-gray-800 dark:to-gray-800 rounded-2xl shadow-lg border border-purple-100 dark:border-gray-700">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-semibold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
          Visual Explanation
        </h3>
        <button
          onClick={generateVisualization}
          disabled={loading || (!problem && !image)}
          className="px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg font-medium hover:from-purple-700 hover:to-blue-700 disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed transition-all duration-200 shadow-md hover:shadow-lg"
        >
          {loading ? (
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span>Generating...</span>
            </div>
          ) : (
            '🎬 Generate Visualization'
          )}
        </button>
      </div>

      {loading && progressMessage && (
        <div className="mb-4">
          <div className="flex justify-between text-sm text-purple-700 dark:text-purple-300 mb-1 font-medium">
            <span>{progressMessage}</span>
            {progressPercentage > 0 && <span>{progressPercentage}%</span>}
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 overflow-hidden">
            <div
              className="bg-gradient-to-r from-purple-600 to-blue-600 h-2.5 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${Math.max(5, progressPercentage)}%` }}
            ></div>
          </div>
        </div>
      )}

      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700">
          <p className="font-medium">Error</p>
          <p className="text-sm mt-1">{error}</p>
        </div>
      )}

      {videoUrl && (
        <div className="space-y-3">
          <div className="bg-black rounded-xl overflow-hidden shadow-xl">
            <video
              controls
              autoPlay
              loop
              className="w-full"
              src={videoUrl}
              onLoadStart={() => console.log('[Video] Load started:', videoUrl)}
              onCanPlay={() => console.log('[Video] Can play')}
              onError={(e) => {
                console.error('[Video] Error loading video:', e);
                console.error('[Video] Video source:', videoUrl);
                setError('Failed to load video. Check console for details.');
              }}
            >
              Your browser does not support the video tag.
            </video>
          </div>
          <p className="text-sm text-gray-600 text-center">
            Mathematical visualization powered by Manim
          </p>
          <p className="text-xs text-gray-500 text-center font-mono">{videoUrl}</p>
        </div>
      )}

      {!videoUrl && !loading && !error && (
        <div className="text-center py-12 text-gray-500 dark:text-gray-400">
          <div className="text-6xl mb-4">📊</div>
          <p className="text-lg font-medium mb-2">No visualization yet</p>
          <p className="text-sm">
            Click the button above to generate a visual explanation of your problem
          </p>
        </div>
      )}
    </div>
  );
}
