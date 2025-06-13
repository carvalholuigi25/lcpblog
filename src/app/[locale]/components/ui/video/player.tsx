/* eslint-disable @typescript-eslint/no-explicit-any */
// components/VideoPlayer.tsx
'use client';
import { getVideoThumbnailPath } from '@/app/[locale]/functions/functions';
import React, { useEffect, useRef } from 'react';
import videojs from 'video.js';

interface VideoPlayerProps {
  id: number;
  src: string;
  type: string;
  poster: string;
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

const VideoPlayer = ({ id, src, type, poster, options }: VideoPlayerProps) => {
  const videoRef = useRef(null);
  const playerRef = useRef<any | null>(null);
  const videoClOpts = getVideoThemeOptions();

  useEffect(() => {
    if (videoRef.current && !playerRef.current) {
      const datasetup = {
        ...options, 
        techOrder: ["html5", "youtube"], 
        sources: [{ 
          src: src, 
          type: type 
        }], 
        poster: getVideoThumbnailPath(poster),
        youtube: { 
          "iv_load_policy": 1,
          "ytControls": 0,
          "frameborder": 0,
          "customVars": { 
            "wmode": "transparent" 
          }
        }
      };

      playerRef.current = videojs(videoRef.current, datasetup, () => {
        console.log('Video.js player is ready');
      });
    }

    return () => {
      if (playerRef.current) {
        playerRef.current.dispose();
        playerRef.current = null;
      }
    };
  }, [src, type, poster, options]);

  return (
    <div key={"myvideo"+id} data-vjs-player>
      <video ref={videoRef} className={`video-js ${videoClOpts}`} />
    </div>
  );
};

export default VideoPlayer;
