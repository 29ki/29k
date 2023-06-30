import React, {useCallback, useMemo, useRef, useState} from 'react';

import {RouteProp, useNavigation, useRoute} from '@react-navigation/native';
import styled from 'styled-components/native';
import {BottomSheetScrollView} from '@gorhom/bottom-sheet';

import Gutters from '../../../lib/components/Gutters/Gutters';

import SheetModal from '../../../lib/components/Modals/SheetModal';
import {
  BottomSafeArea,
  Spacer16,
  Spacer32,
} from '../../../lib/components/Spacers/Spacer';
import {COLORS} from '../../../../../shared/src/constants/colors';
import {SPACINGS} from '../../../lib/constants/spacings';
import {Body18} from '../../../lib/components/Typography/Body/Body';
import BylineUser from '../../../lib/components/Bylines/BylineUser';

import {ModalStackProps} from '../../../lib/navigation/constants/routes';
import VideoLooper from '../../../lib/components/VideoLooper/VideoLooper';
import MediaControls from '../../../lib/components/MediaControls/MediaControls';
import Subtitles from '../../../lib/components/Subtitles/Subtitles';
import {StyleSheet} from 'react-native';

const TextWrapper = styled.View({
  backgroundColor: COLORS.PURE_WHITE,
  borderRadius: 24,
  padding: SPACINGS.SIXTEEN,
});

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
    params: {userProfile, text, videoSource, subtitles},
  } = useRoute<RouteProp<ModalStackProps, 'SharingPostModal'>>();
  const {goBack} = useNavigation();
  const videoRef = useRef<VideoLooper>(null);
  const [duration, setDuration] = useState(0);
  const [progress, setProgress] = useState(0);
  const [paused, setPaused] = useState(true);
  const [showSubtitels, setShowSubtitles] = useState<boolean | undefined>(
    subtitles ? false : undefined,
  );
  const [isLoading, setIsLoading] = useState(true);

  const videoSources = useMemo(() => {
    if (videoSource) {
      return [
        {
          source: videoSource,
          repeat: false,
          muted: false,
        },
      ];
    }
  }, [videoSource]);

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

  if (text) {
    return (
      <SheetModal onPressClose={goBack} backgroundColor={COLORS.WHITE}>
        <BottomSheetScrollView>
          <Wrapper>
            <BylineUser user={userProfile} />
            <Spacer16 />

            <TextWrapper>
              <Body18>{text}</Body18>
            </TextWrapper>
          </Wrapper>
        </BottomSheetScrollView>
      </SheetModal>
    );
  }

  return (
    <SheetModal onPressClose={goBack} backgroundColor={COLORS.WHITE}>
      <Wrapper>
        <BylineUser user={userProfile} />
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
              />
              {subtitles && showSubtitels && (
                <SubtitleContainer>
                  <Gutters>
                    <Subtitles src={subtitles} time={progress} />
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
                subtitles={subtitles ? showSubtitels : undefined}
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
