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

const Audio = styled.audio({
  display: 'none',
});

export type VideoPlayerHandle = {
  seek: (seconds: number) => void;
  play: () => void;
};

const VideoLooper = forwardRef<VideoPlayerHandle, VideoLooperProperties>(
  (
    {
      sources,
      style,
      paused,
      volume = 1,
      muted,
      onProgress,
      onLoad,
      onTransition,
      onEnd,
      onAutoPlayFailed = () => {},
      audioOnly,
    },
    ref,
  ) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const canvasContext = useRef<CanvasRenderingContext2D | null>(null);

    const playerEls = useRef<(HTMLVideoElement | HTMLAudioElement | null)[]>(
      [],
    );
    const currentSource = useRef(0);

    const setVideoRef = useCallback(
      (sourceIndex: number): React.RefCallback<HTMLVideoElement> =>
        (videoRef: HTMLVideoElement | null) => {
          playerEls.current[sourceIndex] = videoRef;
        },
      [],
    );

    const getCurrentPlayerEl = useCallback(
      () => playerEls.current[currentSource.current],
      [],
    );

    const getCurrentVideoEl = useCallback(
      () => !audioOnly && (getCurrentPlayerEl() as HTMLVideoElement),
      [audioOnly, getCurrentPlayerEl],
    );

    const isCurrentSource = useCallback(
      (index: number) => index === currentSource.current,
      [],
    );

    const stopAllPlayers = useCallback(
      () => playerEls.current.forEach(videoRef => videoRef?.pause()),
      [],
    );

    const playCurrentSource = useCallback(
      () => getCurrentPlayerEl()?.play(),
      [getCurrentPlayerEl],
    );

    const stopCurrentSource = useCallback(
      () => getCurrentPlayerEl()?.pause(),
      [getCurrentPlayerEl],
    );

    const togglePaused = useCallback(
      async (pause?: boolean) => {
        if (pause) {
          await stopCurrentSource();
        } else {
          await playCurrentSource();
        }
      },
      [stopCurrentSource, playCurrentSource],
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
        const playerEl = getCurrentPlayerEl();
        if (playerEl) {
          playerEl.currentTime = seconds;
        }
      },
      [getCurrentPlayerEl],
    );

    useImperativeHandle(ref, () => ({seek, play: playCurrentSource}), [
      seek,
      playCurrentSource,
    ]);

    const onLoadedMetadata = useCallback(
      (sourceIndex: number) => () => {
        const videoEl = getCurrentVideoEl();
        if (isCurrentSource(sourceIndex) && canvasRef.current && videoEl) {
          canvasContext.current = canvasRef.current.getContext('2d', {
            alpha: true,
            desynchronized: true,
            willReadFrequently: true,
          });
          canvasRef.current.width = videoEl.videoWidth;
          canvasRef.current.height = videoEl.videoHeight;
        }
      },
      [getCurrentVideoEl, isCurrentSource],
    );

    const onLoadedData = useCallback(
      (sourceIndex: number) => () => {
        const playerEl = getCurrentPlayerEl();
        const videoEl = getCurrentVideoEl();
        if (isCurrentSource(sourceIndex) && playerEl) {
          if (videoEl) {
            drawCurrentFrame();
            videoEl.requestVideoFrameCallback(drawCurrentFrame);
          }
          if (onLoad) {
            onLoad({duration: playerEl.duration});
          }
        }
      },
      [
        onLoad,
        drawCurrentFrame,
        getCurrentPlayerEl,
        getCurrentVideoEl,
        isCurrentSource,
      ],
    );

    const onTimeUpdate = useCallback(
      (sourceIndex: number) => () => {
        const videoEl = getCurrentPlayerEl();
        if (isCurrentSource(sourceIndex) && onProgress && videoEl) {
          onProgress({time: videoEl.currentTime});
        }
      },
      [onProgress, getCurrentPlayerEl, isCurrentSource],
    );

    const onEnded = useCallback(
      (sourceIndex: number) => () => {
        if (isCurrentSource(sourceIndex) && sourceIndex < sources.length - 1) {
          currentSource.current = sourceIndex + 1;
          stopAllPlayers();
          playCurrentSource();

          if (onTransition) {
            onTransition();
          }
        } else if (onEnd) {
          onEnd();
        }
      },
      [
        sources,
        isCurrentSource,
        stopAllPlayers,
        playCurrentSource,
        onTransition,
        onEnd,
      ],
    );

    const onPlay = useCallback(
      (sourceIndex: number) => () => {
        if (isCurrentSource(sourceIndex)) {
          drawFrames();
        }
      },
      [drawFrames, isCurrentSource],
    );

    const checkAutoPlayError = useCallback(
      (e: any) => {
        /*
        This function deals with autoplay policy errors
        https://goo.gl/xX8pDD
        https://webkit.org/blog/7734/auto-play-policy-changes-for-macos/
      */
        if (e.name === 'NotAllowedError') {
          onAutoPlayFailed();
          return;
        }

        throw e;
      },
      [onAutoPlayFailed],
    );

    const checkAutoPlayPolicy = useCallback(() => {
      /*
        This function checks the autoplay policy
        https://developer.mozilla.org/en-US/docs/Web/Media/Autoplay_guide
      */
      const playerEl = getCurrentPlayerEl();
      if (
        playerEl &&
        navigator.getAutoplayPolicy &&
        navigator.getAutoplayPolicy(playerEl) !== 'allowed'
      ) {
        onAutoPlayFailed();
      }
    }, [getCurrentPlayerEl, onAutoPlayFailed]);

    useEffect(() => {
      checkAutoPlayPolicy();
      togglePaused(paused).catch(checkAutoPlayError);
    }, [paused, togglePaused, checkAutoPlayError, checkAutoPlayPolicy]);

    useEffect(() => {
      const playerEl = getCurrentPlayerEl();
      if (playerEl) {
        playerEl.volume = volume;
      }
    }, [volume, getCurrentPlayerEl, paused]);

    useEffect(() => {
      if (!muted && !paused) {
        // This makes sure that the audio gets played again when the user unmutes the video after an onAutoPlayFailed event
        playCurrentSource();
      }
    }, [muted, paused, playCurrentSource]);

    const Component = audioOnly ? Audio : Video;

    return (
      <Wrapper style={style}>
        {!audioOnly && <Canvas ref={canvasRef} />}
        {sources.map(({source, repeat: sourceRepeat}, sourceIndex) => (
          <Component
            key={source}
            ref={setVideoRef(sourceIndex)}
            src={source}
            onLoadedMetadata={onLoadedMetadata(sourceIndex)}
            onLoadedData={onLoadedData(sourceIndex)}
            onTimeUpdate={onTimeUpdate(sourceIndex)}
            onEnded={onEnded(sourceIndex)}
            onPlay={onPlay(sourceIndex)}
            loop={sourceRepeat}
            autoPlay={!paused && isCurrentSource(sourceIndex)}
            muted={muted}
            playsInline
          />
        ))}
      </Wrapper>
    );
  },
);

export default React.memo(VideoLooper);
