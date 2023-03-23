export interface SourceConfig {
  source: string;
  repeat?: boolean;
  muted?: boolean;
}
export interface VideoLooperProperties extends ViewProps {
  sources: Array<SourceConfig>;
  poster?: string;
  paused?: boolean;
  repeat?: boolean;
  volume?: number;
  audioOnly?: boolean;
  onEnd?: () => void;
  onReadyForDisplay?: () => void;
  onTransition?: () => void;
}

export default class VideoLooper extends React.Component<VideoLooperProperties> {}
