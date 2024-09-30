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
  (
    {
      sources,
      style,
      paused,
      volume = 1,
      onProgress,
      onLoad,
      onTransition,
      onEnd,
    },
    ref,
  ) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const canvasContext = useRef<CanvasRenderingContext2D | null>(null);

    const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);
    const currentVideoSource = useRef(0);

    const setVideoRef = useCallback(
      (sourceIndex: number): React.RefCallback<HTMLVideoElement> =>
        (videoRef: HTMLVideoElement | null) => {
          videoRefs.current[sourceIndex] = videoRef;
        },
      [],
    );

    const getCurrentVideoEl = useCallback(
      () => videoRefs.current[currentVideoSource.current],
      [],
    );

    const isCurrentVideoSource = useCallback(
      (index: number) => index === currentVideoSource.current,
      [],
    );

    const stopAllVideos = useCallback(
      () => videoRefs.current.forEach(videoRef => videoRef?.pause()),
      [],
    );

    const playCurrentVideo = useCallback(
      () => getCurrentVideoEl()?.play(),
      [getCurrentVideoEl],
    );

    const stopCurrentVideo = useCallback(
      () => getCurrentVideoEl()?.pause(),
      [getCurrentVideoEl],
    );

    const togglePaused = useCallback(
      (pause?: boolean) => {
        if (pause) {
          stopCurrentVideo();
        } else {
          playCurrentVideo();
        }
      },
      [stopCurrentVideo, playCurrentVideo],
    );

    const drawCurrentFrame = useCallback(() => {
      const videoEl = getCurrentVideoEl();
      if (canvasContext.current && canvasRef.current && videoEl) {
        canvasContext.current.drawImage(
          videoEl,
          0,
          0,
          canvasRef.current.width,
          canvasRef.current.height,
        );
      }
    }, [getCurrentVideoEl]);

    const drawFrames = useCallback(() => {
      const videoEl = getCurrentVideoEl();
      if (videoEl && !videoEl.paused && !videoEl.ended) {
        videoEl.requestVideoFrameCallback(() => {
          drawCurrentFrame();
          drawFrames();
        });
      }
    }, [drawCurrentFrame, getCurrentVideoEl]);

    const seek = useCallback(
      (seconds: number) => {
        const videoEl = getCurrentVideoEl();
        if (videoEl) {
          videoEl.currentTime = seconds;
        }
      },
      [getCurrentVideoEl],
    );

    useImperativeHandle(ref, () => ({seek}), [seek]);

    const onLoadedMetadata = useCallback(
      (sourceIndex: number) => () => {
        const videoEl = getCurrentVideoEl();
        if (isCurrentVideoSource(sourceIndex) && canvasRef.current && videoEl) {
          canvasContext.current = canvasRef.current.getContext('2d', {
            alpha: true,
            desynchronized: true,
            willReadFrequently: true,
          });
          canvasRef.current.width = videoEl.videoWidth;
          canvasRef.current.height = videoEl.videoHeight;
        }
      },
      [getCurrentVideoEl, isCurrentVideoSource],
    );

    const onLoadedData = useCallback(
      (sourceIndex: number) => () => {
        const videoEl = getCurrentVideoEl();
        if (isCurrentVideoSource(sourceIndex) && videoEl) {
          videoEl.muted = false;
          drawCurrentFrame();
          videoEl.requestVideoFrameCallback(drawCurrentFrame);
          if (onLoad) {
            onLoad({duration: videoEl.duration});
          }
        }
      },
      [onLoad, drawCurrentFrame, getCurrentVideoEl, isCurrentVideoSource],
    );

    const onTimeUpdate = useCallback(
      (sourceIndex: number) => () => {
        const videoEl = getCurrentVideoEl();
        if (isCurrentVideoSource(sourceIndex) && onProgress && videoEl) {
          onProgress({time: videoEl.currentTime});
        }
      },
      [onProgress, getCurrentVideoEl, isCurrentVideoSource],
    );

    const onEnded = useCallback(
      (sourceIndex: number) => () => {
        if (
          isCurrentVideoSource(sourceIndex) &&
          sourceIndex < sources.length - 1
        ) {
          currentVideoSource.current = sourceIndex + 1;
          stopAllVideos();
          playCurrentVideo();

          if (onTransition) {
            onTransition();
          }
        } else if (onEnd) {
          onEnd();
        }
      },
      [
        sources,
        isCurrentVideoSource,
        stopAllVideos,
        playCurrentVideo,
        onTransition,
        onEnd,
      ],
    );

    const onPlay = useCallback(
      (sourceIndex: number) => () => {
        if (isCurrentVideoSource(sourceIndex)) {
          drawFrames();
        }
      },
      [drawFrames, isCurrentVideoSource],
    );

    useEffect(() => {
      const videoEl = getCurrentVideoEl();
      if (videoEl) {
        videoEl.volume = volume;
      }
    }, [volume, getCurrentVideoEl]);

    useEffect(() => {
      togglePaused(paused);
    }, [paused, togglePaused]);

    return (
      <Wrapper style={style}>
        <Canvas ref={canvasRef} />
        {sources.map(({source, repeat: sourceRepeat}, sourceIndex) => (
          <Video
            key={source}
            ref={setVideoRef(sourceIndex)}
            src={source}
            onLoadedMetadata={onLoadedMetadata(sourceIndex)}
            onLoadedData={onLoadedData(sourceIndex)}
            onTimeUpdate={onTimeUpdate(sourceIndex)}
            onEnded={onEnded(sourceIndex)}
            onPlay={onPlay(sourceIndex)}
            loop={sourceRepeat}
            autoPlay={!paused && isCurrentVideoSource(sourceIndex)}
            playsInline
            muted
          />
        ))}
      </Wrapper>
    );
  },
);

export default VideoLooper;
