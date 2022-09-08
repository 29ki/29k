import React, {useContext, useEffect} from 'react';
import {ActivityIndicator} from 'react-native';
import {useRecoilValue} from 'recoil';

import styled from 'styled-components/native';
import {useTranslation} from 'react-i18next';

import {
  videoSharingFields,
  participantsSelector,
  templeAtom,
  localParticipantSelector,
} from './state/state';
import {RouteProp, useNavigation, useRoute} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';

import {
  Spacer8,
  Spacer12,
  Spacer16,
} from '../../common/components/Spacers/Spacer';
import AudioToggleButton from './components/Buttons/AudioToggleButton';
import VideoToggleButton from './components/Buttons/VideoToggleButton';
import {COLORS} from '../../common/constants/colors';
import LeaveButton from './components/Buttons/LeaveButton';
import {RootStackProps, TempleStackProps} from '../../common/constants/routes';
import useTemple from './hooks/useTemple';
import {DailyContext} from './DailyProvider';
import NS from '../../lib/i18n/constants/namespaces';
import Participants from './Participants';

import Content from './components/Content/Content';
import SlideButton from './components/Buttons/SlideButton';
import {
  ChevronRight,
  ChevronLeft,
  Play,
  Pause,
  Rewind,
} from '../../common/components/Icons';
import useExerciseById from '../../lib/content/hooks/useExerciseById';
import {userAtom} from '../../lib/user/state/state';

type ScreenNavigationProps = NativeStackNavigationProp<RootStackProps, 'Tabs'>;

const LoadingView = styled.View({
  flex: 1,
  justifyContent: 'center',
});

const Spotlight = styled.View({
  aspectRatio: '0.85',
});

const MainViewContainer = styled.View({
  flex: 1,
});

const SessionControls = styled.View({
  flexDirection: 'row',
  justifyContent: 'center',
});

const ContentControls = styled.View({
  position: 'absolute',
  bottom: 20,
  left: 20,
  right: 20,
  flexDirection: 'row',
});

const MediaControls = styled.View({
  flex: 1,
  flexDirection: 'row',
  justifyContent: 'center',
});

const Session = () => {
  const {joinMeeting, leaveMeeting, toggleAudio, toggleVideo} =
    useContext(DailyContext);
  const {
    params: {templeId},
  } = useRoute<RouteProp<TempleStackProps, 'Temple'>>();

  const {navigate} = useNavigation<ScreenNavigationProps>();
  const {t} = useTranslation(NS.SCREEN.TEMPLE);
  const {
    subscribeTemple,
    navigateToIndex,
    setActive,
    setPlaying,
    setDailyFacilitatorId,
  } = useTemple();
  const user = useRecoilValue(userAtom);

  const temple = useRecoilValue(templeAtom);
  const participants = useRecoilValue(participantsSelector);
  const me = useRecoilValue(localParticipantSelector);
  const isLoading = useRecoilValue(videoSharingFields('isLoading'));
  const content = useExerciseById(temple?.contentId);

  useEffect(() => {
    if (temple?.facilitator === user?.uid && me?.user_id) {
      setDailyFacilitatorId(me.user_id);
    }
    joinMeeting();
  }, [
    joinMeeting,
    setDailyFacilitatorId,
    me?.user_id,
    user?.uid,
    temple?.facilitator,
  ]);

  useEffect(() => {
    const unsubscribe = subscribeTemple(templeId);
    return unsubscribe;
  }, [subscribeTemple, templeId]);

  const exitMeeting = async () => {
    await leaveMeeting();
    navigate('Tabs');
  };

  if (isLoading) {
    return (
      <LoadingView>
        <ActivityIndicator size="large" color={COLORS.BLACK} />
      </LoadingView>
    );
  }

  const hasAudio = Boolean(me?.audioTrack);
  const hasVideo = Boolean(me?.videoTrack);

  return (
    <MainViewContainer>
      <Spotlight>
        {!temple?.active && temple?.facilitator === user?.uid && (
          <ContentControls>
            <SlideButton
              onPress={() => setActive(true)}
              RightIcon={ChevronRight}>
              {t('controls.start')}
            </SlideButton>
          </ContentControls>
        )}
        {temple?.active && (
          <>
            <Content
              content={content}
              contentIndex={temple.index}
              playing={temple.playing}
            />
            {temple?.facilitator === user?.uid && (
              <ContentControls>
                {temple.index > 0 && (
                  <SlideButton
                    LeftIcon={ChevronLeft}
                    onPress={() => navigateToIndex(temple.index - 1)}
                  />
                )}
                <MediaControls>
                  <SlideButton
                    LeftIcon={Rewind}
                    onPress={() => setPlaying(!temple.playing)}
                  />
                  <Spacer8 />
                  <SlideButton
                    LeftIcon={temple.playing ? Pause : Play}
                    onPress={() => setPlaying(!temple.playing)}
                  />
                </MediaControls>
                {temple.index < content.length - 1 && (
                  <SlideButton
                    RightIcon={ChevronRight}
                    onPress={() => navigateToIndex(temple.index + 1)}
                  />
                )}
              </ContentControls>
            )}
          </>
        )}
      </Spotlight>
      {participants && <Participants participants={participants} />}
      <Spacer16 />
      <SessionControls>
        <AudioToggleButton
          onPress={() => toggleAudio(!hasAudio)}
          active={hasAudio}
        />
        <Spacer12 />
        <VideoToggleButton
          onPress={() => toggleVideo(!hasVideo)}
          active={hasVideo}
        />
        <Spacer12 />
        <LeaveButton fill={COLORS.ROSE500} onPress={exitMeeting} />
      </SessionControls>
      <Spacer16 />
    </MainViewContainer>
  );
};

export default Session;
