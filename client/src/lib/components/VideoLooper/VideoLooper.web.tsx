import 'rvfc-polyfill';
import React, {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
} from 'react';
import {VideoLooperProperties} from './VideoLooper';
import styled from 'styled-components';

const Wrapper = styled.div({
  position: 'relative',
  overflow: 'hidden',
});

const Canvas = styled.canvas({
  position: 'absolute',
  left: 0,
  right: 0,
  top: '50%',
  bottom: 0,
  width: '100%',
  overflow: 'hidden',
  transform: 'translateY(-50%)',
});

const Video = styled.video({
  display: 'none',
});

export type VideoPlayerHandle = {
  seek: (seconds: number) => void;
};

const VideoLooper = forwardRef<VideoPlayerHandle, VideoLooperProperties>(
  ({sources, style, paused, repeat, volume = 1, onProgress, onLoad}, ref) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const videoRef = useRef<HTMLVideoElement>(null);

    const togglePaused = useCallback((pause?: boolean) => {
      if (pause) {
        videoRef.current?.pause();
      } else {
        videoRef.current?.play();
      }
    }, []);

    const drawCurrentFrame = useCallback(() => {
      if (canvasRef.current && videoRef.current) {
        canvasRef.current.getContext('2d')?.drawImage(videoRef.current, 0, 0);
      }
    }, []);

    const drawFrames = useCallback(() => {
      if (
        videoRef.current &&
        !videoRef.current.paused &&
        !videoRef.current.ended
      ) {
        videoRef.current.requestVideoFrameCallback(() => {
          drawCurrentFrame();
          drawFrames();
        });
      }
    }, [drawCurrentFrame]);

    const seek = useCallback((seconds: number) => {
      if (videoRef.current) {
        videoRef.current.currentTime = seconds;
      }
    }, []);

    useImperativeHandle(ref, () => ({seek}), [seek]);

    const onLoadedMetadata = useCallback(() => {
      if (canvasRef.current && videoRef.current) {
        canvasRef.current.width = videoRef.current.videoWidth;
        canvasRef.current.height = videoRef.current.videoHeight;
      }
    }, []);

    const onLoadedData = useCallback(() => {
      if (videoRef.current) {
        videoRef.current.muted = false;
        videoRef.current.requestVideoFrameCallback(drawCurrentFrame);
        if (onLoad) {
          onLoad({duration: videoRef.current.duration});
        }
      }
    }, [onLoad, drawCurrentFrame]);

    const onTimeUpdate = useCallback(() => {
      if (onProgress && videoRef.current) {
        onProgress({time: videoRef.current.currentTime});
      }
    }, [onProgress]);

    const onPlay = useCallback(() => {
      drawFrames();
    }, [drawFrames]);

    useEffect(() => {
      togglePaused(paused);
    }, [paused, togglePaused]);

    useEffect(() => {
      if (videoRef.current) {
        videoRef.current.volume = volume;
      }
    }, [volume]);

    return (
      <Wrapper style={style}>
        <Canvas ref={canvasRef} />
        <Video
          ref={videoRef}
          onLoadedMetadata={onLoadedMetadata}
          onLoadedData={onLoadedData}
          onTimeUpdate={onTimeUpdate}
          onPlay={onPlay}
          loop={repeat || sources[0].repeat}
          autoPlay={!paused}
          muted>
          {sources.map(({source}) => (
            <source src={source} />
          ))}
        </Video>
      </Wrapper>
    );
  },
);

export default VideoLooper;
