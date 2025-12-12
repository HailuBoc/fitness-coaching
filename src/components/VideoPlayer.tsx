'use client';

// Video Player Component for Exercise Demos
import { useState } from 'react';
import { Play, Pause } from 'lucide-react';

interface VideoPlayerProps {
  src: string;
  compact?: boolean;
}

export function VideoPlayer({ src, compact = false }: VideoPlayerProps) {
  const [playing, setPlaying] = useState(false);
  const [videoRef, setVideoRef] = useState<HTMLVideoElement | null>(null);

  const togglePlay = () => {
    if (videoRef) {
      if (playing) {
        videoRef.pause();
      } else {
        videoRef.play();
      }
      setPlaying(!playing);
    }
  };

  // For demo purposes, using a placeholder video URL
  // In production, replace with actual video URLs
  const videoSrc =
    src ||
    'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4';

  if (compact) {
    return (
      <div className="relative w-24 h-16 bg-gray-900 rounded overflow-hidden">
        <video
          ref={setVideoRef}
          src={videoSrc}
          className="w-full h-full object-cover"
          onPlay={() => setPlaying(true)}
          onPause={() => setPlaying(false)}
        />
        <button
          onClick={togglePlay}
          className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 hover:bg-opacity-70 transition-opacity"
        >
          {playing ? (
            <Pause className="w-6 h-6 text-white" />
          ) : (
            <Play className="w-6 h-6 text-white" />
          )}
        </button>
      </div>
    );
  }

  return (
    <div className="relative w-full bg-gray-900 rounded-lg overflow-hidden aspect-video">
      <video
        ref={setVideoRef}
        src={videoSrc}
        className="w-full h-full object-contain"
        controls
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
      />
    </div>
  );
}

