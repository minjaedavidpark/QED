import { useState } from 'react';

interface VisualizationPanelProps {
  problem: string;
  onVisualize?: () => void;
}

export default function VisualizationPanel({ problem, onVisualize }: VisualizationPanelProps) {
  const [loading, setLoading] = useState(false);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const generateVisualization = async () => {
    if (!problem || problem.trim().length === 0) {
      console.error('[VisualizationPanel] No problem provided');
      setError('Please provide a problem first');
      return;
    }

    console.log('[VisualizationPanel] Starting visualization generation');
    console.log('[VisualizationPanel] Problem:', problem.substring(0, 100));

    setLoading(true);
    setError(null);
    setVideoUrl(null);

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
        body: JSON.stringify({ problem }),
      });

      console.log('[VisualizationPanel] Response status:', response.status);

      let data;
      try {
        data = await response.json();
      } catch (parseError) {
        console.error('[VisualizationPanel] Failed to parse response JSON:', parseError);
        if (!response.ok) {
          throw new Error(`Server error (${response.status}): ${response.statusText}`);
        }
        throw new Error('Invalid response from server');
      }

      console.log('[VisualizationPanel] Response data:', data);

      if (!response.ok) {
        console.error('[VisualizationPanel] Error response:', data);
        throw new Error(data.details || data.error || 'Failed to generate visualization');
      }

      console.log('[VisualizationPanel] Success! Video URL:', data.videoUrl);
      setVideoUrl(data.videoUrl);
    } catch (err) {
      console.error('[VisualizationPanel] Exception:', err);
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-6 p-6 bg-gradient-to-br from-purple-50 via-white to-blue-50 rounded-2xl shadow-lg border border-purple-100">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-semibold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
          Visual Explanation
        </h3>
        <button
          onClick={generateVisualization}
          disabled={loading || !problem}
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
        <div className="text-center py-12 text-gray-500">
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
