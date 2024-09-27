import React, {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
} from 'react';
import {VideoLooperProperties} from './VideoLooper';
import styled from 'styled-components';

const Video = styled.video({
  width: '100%',
});

export type VideoPlayerHandle = {
  seek: (seconds: number) => void;
};

const VideoLooper = forwardRef<VideoPlayerHandle, VideoLooperProperties>(
  ({sources, style, paused, repeat, volume = 1, onProgress, onLoad}, ref) => {
    const videoRef = useRef<HTMLVideoElement>(null);

    const togglePaused = useCallback((pause?: boolean) => {
      if (pause) {
        videoRef.current?.pause();
      } else {
        videoRef.current?.play();
      }
    }, []);

    const onLoadedData = useCallback(() => {
      if (onLoad && videoRef.current) {
        videoRef.current.muted = false;
        onLoad({duration: videoRef.current.duration});
      }
    }, [onLoad]);

    const onTimeUpdate = useCallback(() => {
      if (onProgress && videoRef.current) {
        onProgress({time: videoRef.current.currentTime});
      }
    }, [onProgress]);

    const seek = useCallback((seconds: number) => {
      if (videoRef.current) {
        videoRef.current.currentTime = seconds;
      }
    }, []);

    useImperativeHandle(ref, () => ({seek}), [seek]);

    useEffect(() => {
      togglePaused(paused);
    }, [paused, togglePaused]);

    useEffect(() => {
      videoRef.current?.load();
      togglePaused(paused);
    }, [sources, togglePaused, paused]);

    useEffect(() => {
      if (videoRef.current) {
        videoRef.current.volume = volume;
      }
    }, [volume]);

    return (
      <Video
        style={style}
        ref={videoRef}
        onLoadedData={onLoadedData}
        onTimeUpdate={onTimeUpdate}
        loop={repeat || sources[0].repeat}
        muted>
        {sources.map(({source}) => (
          <source src={source} />
        ))}
      </Video>
    );
  },
);

export default VideoLooper;
