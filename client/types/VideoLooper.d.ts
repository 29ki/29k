export interface VideoLooperProperties extends ViewProps {
  sources: {start?: string; loop?: string; end?: string};
  posters?: {start?: string; loop?: string; end?: string};
  mutes: {start?: boolean; loop?: boolean; end?: boolean};
  repeat?: boolean;
  paused?: boolean;
  onStartEnd?: () => void;
  onEnd?: () => void;
  onReadyForDisplay?: () => void;
  onTransition?: () => void;
}

export default class VideoLooper extends React.Component<VideoLooperProperties> {
  seek(time: number): void;
}
