export interface SourceConfig {
  source: string;
  repeat?: boolean;
}
export interface VideoLooperProperties extends ViewProps {
  sources: Array<SourceConfig>;
  paused?: boolean;
  repeat?: boolean;
  volume?: number;
  muted?: boolean;
  audioOnly?: boolean;
  mixWithOthers?: boolean;
  onEnd?: () => void;
  onLoad?: ({duration: number}) => void;
  onTransition?: () => void;
  onError?: ({cause: string}) => void;
}

export default class VideoLooper extends React.Component<VideoLooperProperties> {
  seek(to: number): void;
}
