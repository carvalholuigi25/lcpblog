export interface VideoJsOptions {
  controls: boolean;
  autoplay: boolean;
  responsive: boolean;
  posterImage: boolean;
  fluid: boolean;
  preload: string;
  sources: { src?: string; type?: string }[];
  techOrder?: string[];
  poster?: string;
  youtube?: {
    iv_load_policy?: number;
    ytControls?: number;
    frameborder?: number;
    customVars: { wmode?: string };
  };
}

export interface VideoPlayerProps {
  id: number;
  src: string;
  type: string;
  poster: string;
  options: VideoJsOptions;
}

export interface VideoThemePlayerProps {
  name: string;
  size: string;
  bordered: boolean;
}