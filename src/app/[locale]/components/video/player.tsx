/* eslint-disable @typescript-eslint/no-explicit-any */
// components/VideoPlayer.tsx
'use client';
import React, { useEffect, useRef } from 'react';
import videojs from 'video.js';

interface VideoPlayerProps {
  options: any;
}

const VideoPlayer = ({ options }: VideoPlayerProps) => {
  const videoRef = useRef(null);
  const playerRef = useRef<any | null>(null);
  const isBigBordered = false;

  useEffect(() => {
    if (videoRef.current && !playerRef.current) {
      playerRef.current = videojs(videoRef.current, options, () => {
        console.log('Video.js player is ready');
      });
    }

    return () => {
      if (playerRef.current) {
        playerRef.current.dispose();
        playerRef.current = null;
      }
    };
  }, [options]);

  return (
    <div data-vjs-player>
      <video ref={videoRef} className={`video-js vjs-default-skin vjs-lcp ${isBigBordered ? "big bordered": ""}`} />
    </div>
  );
};

export default VideoPlayer;
