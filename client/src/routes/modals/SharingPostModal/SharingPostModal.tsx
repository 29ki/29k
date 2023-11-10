import React, {useCallback, useMemo, useRef, useState} from 'react';

import {
  RouteProp,
  useIsFocused,
  useNavigation,
  useRoute,
} from '@react-navigation/native';
import styled from 'styled-components/native';
import {BottomSheetScrollView} from '@gorhom/bottom-sheet';

import Gutters from '../../../lib/components/Gutters/Gutters';

import SheetModal from '../../../lib/components/Modals/SheetModal';
import {
  BottomSafeArea,
  Spacer16,
  Spacer24,
  Spacer32,
} from '../../../lib/components/Spacers/Spacer';
import {COLORS} from '../../../../../shared/src/constants/colors';
import {SPACINGS} from '../../../lib/constants/spacings';
import BylineUser from '../../../lib/components/Bylines/BylineUser';

import {ModalStackProps} from '../../../lib/navigation/constants/routes';
import VideoLooper from '../../../lib/components/VideoLooper/VideoLooper';
import MediaControls from '../../../lib/components/MediaControls/MediaControls';
import Subtitles from '../../../lib/components/Subtitles/Subtitles';
import {StyleSheet} from 'react-native';
import SharingPostCard from '../../../lib/components/PostCard/SharingPostCard';
import ExerciseCard from '../../../lib/components/Cards/SessionCard/ExerciseCard';
import useExerciseById from '../../../lib/content/hooks/useExerciseById';
import RelatedSessions from './components/RelatedSessions';

const Wrapper = styled(Gutters)({
  flex: 1,
});

const Spinner = styled.ActivityIndicator({
  ...StyleSheet.absoluteFillObject,
});

const VideoWrapper = styled.View({
  flex: 1,
});

const VideoPlayer = styled(VideoLooper)({
  aspectRatio: '1',
  width: '100%',
  borderRadius: 16,
});

const SubtitleContainer = styled.View({
  position: 'absolute',
  bottom: 16,
  left: 0,
  right: 0,
  flex: 1,
  alignItems: 'center',
});

const SharingPostModal = () => {
  const {
    params: {sharingPost, showRelated},
  } = useRoute<RouteProp<ModalStackProps, 'SharingPostModal'>>();

  const video =
    sharingPost.type === 'video' ? sharingPost.item.video : undefined;

  const exerciseId =
    sharingPost.type === 'post'
      ? sharingPost.payload.exerciseId
      : sharingPost.item.exerciseId;

  const {goBack} = useNavigation();
  const videoRef = useRef<VideoLooper>(null);
  const [duration, setDuration] = useState(0);
  const [progress, setProgress] = useState(0);
  const [paused, setPaused] = useState(false);
  const [showSubtitels, setShowSubtitles] = useState<boolean | undefined>(
    video?.subtitles ? false : undefined,
  );
  const [isLoading, setIsLoading] = useState(true);

  const exercise = useExerciseById(exerciseId);

  const videoSources = useMemo(() => {
    if (video) {
      return [
        {
          source: video.source,
          repeat: false,
          muted: false,
        },
      ];
    }
  }, [video]);

  const onLoad = useCallback<(data: {duration: number}) => void>(
    data => {
      setIsLoading(false);
      setDuration(data.duration);
    },
    [setDuration, setIsLoading],
  );

  const onProgress = useCallback(
    (data: {time: number}) => {
      const currentTime = Math.min(Math.round(duration), Math.round(data.time));
      setProgress(currentTime);
    },
    [setProgress, duration],
  );

  const onSkipBack = useCallback(() => {
    videoRef.current?.seek(Math.max(progress - 15, 0));
  }, [progress]);

  const onSkipForward = useCallback(() => {
    if (progress + 15 < duration) {
      videoRef.current?.seek(progress + 15);
    }
  }, [progress, duration]);

  const onTogglePlay = useCallback(() => {
    setPaused(state => !state);
  }, [setPaused]);

  const onToggleSubtitles = useCallback(() => {
    setShowSubtitles(state => !state);
  }, [setShowSubtitles]);

  if (sharingPost.type !== 'video') {
    return (
      <SheetModal backgroundColor={COLORS.PURE_WHITE}>
        <BottomSheetScrollView focusHook={useIsFocused}>
          <Gutters>
            {showRelated && exercise && (
              <>
                <ExerciseCard exercise={exercise} />
                <Spacer16 />
              </>
            )}
            <SharingPostCard sharingPost={sharingPost} />
            <Spacer24 />
          </Gutters>
          {showRelated && exercise && <RelatedSessions exercise={exercise} />}
          <BottomSafeArea minSize={SPACINGS.SIXTEEN} />
        </BottomSheetScrollView>
      </SheetModal>
    );
  }

  return (
    <SheetModal onPressClose={goBack} backgroundColor={COLORS.PURE_WHITE}>
      <Wrapper>
        <BylineUser user={sharingPost.item.profile} />
        <Spacer16 />
        {isLoading && <Spinner size="large" />}
        {videoSources && (
          <>
            <VideoWrapper>
              <VideoPlayer
                ref={videoRef}
                sources={videoSources}
                paused={paused}
                onLoad={onLoad}
                onProgress={onProgress}
                volume={1}
              />
              {video?.subtitles && showSubtitels && (
                <SubtitleContainer>
                  <Gutters>
                    <Subtitles src={video?.subtitles} time={progress} />
                  </Gutters>
                </SubtitleContainer>
              )}
            </VideoWrapper>

            <Spacer32 />
            <Gutters>
              <MediaControls
                light
                time={progress}
                duration={duration}
                playing={!paused}
                onSkipBack={onSkipBack}
                onTogglePlay={onTogglePlay}
                onSkipForward={onSkipForward}
                onToggleSubtitles={onToggleSubtitles}
                subtitles={video?.subtitles ? showSubtitels : undefined}
              />
            </Gutters>
            <Spacer32 />
            <BottomSafeArea />
          </>
        )}
      </Wrapper>
    </SheetModal>
  );
};

export default React.memo(SharingPostModal);
