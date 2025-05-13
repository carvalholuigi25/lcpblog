/* eslint-disable @typescript-eslint/no-explicit-any */
// components/VideoPlayer.tsx
'use client';
import React, { useEffect, useRef } from 'react';
import videojs from 'video.js';

interface VideoPlayerProps {
  options: any;
}

interface VideoThemePlayerProps {
  name: string;
  size: string;
  bordered: boolean;
}

const optstheme: VideoThemePlayerProps = {
  name: "lcp",
  size: "big",
  bordered: true
}

const getVideoThemeOptions = () => {
  return `vjs-default-skin vjs-${optstheme.name} ${optstheme.size} ${optstheme.bordered ? "bordered" : ""}`;
}

const VideoPlayer = ({ options }: VideoPlayerProps) => {
  const videoRef = useRef(null);
  const playerRef = useRef<any | null>(null);
  const videoClOpts = getVideoThemeOptions();

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
      <video ref={videoRef} className={`video-js ${videoClOpts}`} />
    </div>
  );
};

export default VideoPlayer;
