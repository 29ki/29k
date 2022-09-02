import React, {useContext, useEffect} from 'react';
import {ActivityIndicator, TouchableOpacity} from 'react-native';
import {useRecoilValue, useSetRecoilState} from 'recoil';
import {
  DailyMediaView,
  DailyParticipant,
} from '@daily-co/react-native-daily-js';
import styled from 'styled-components/native';
import {useTranslation} from 'react-i18next';

import {
  selectedParticipantIdAtom,
  videoSharingFields,
  participantsSelector,
  selectedParticipantSelector,
  templeAtom,
} from './state/state';
import {RouteProp, useNavigation, useRoute} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';

import {Spacer12, Spacer16} from '../../common/components/Spacers/Spacer';
import AudioToggleButton from './components/Buttons/AudioToggleButton';
import VideoToggleButton from './components/Buttons/VideoToggleButton';
import {COLORS} from '../../common/constants/colors';
import LeaveButton from './components/Buttons/LeaveButton';
import {
  RootStackProps,
  RootStackRoutes,
  TempleStackProps,
} from '../../common/constants/routes';
import useTemple from './hooks/useTemple';
import {DailyContext} from './DailyProvider';
import NS from '../../lib/i18n/constants/namespaces';
import Participants from './Participants';
import ParticipantName from './ParticipantName';
import ParticipantAudio from './ParticipantAudio';
import Content from './components/Content/Content';
import SlideButton from './components/Buttons/SlideButton';
import {ChevronRight} from '../../common/components/Icons';

type ScreenNavigationProps = NativeStackNavigationProp<RootStackProps, 'Tabs'>;

const LoadingView = styled.View({
  flex: 1,
  justifyContent: 'center',
});

const Spotlight = styled.View({
  aspectRatio: '0.85',
});

const SpotlightVideo = styled.View({
  flex: 1,
});

const MainViewContainer = styled.View({
  flex: 1,
});

const SessionControls = styled.View({
  flexDirection: 'row',
  justifyContent: 'center',
});

const DailyMediaViewWrapper = styled(DailyMediaView)({
  height: '100%',
  width: '100%',
});

const ContentControls = styled.View({
  position: 'absolute',
  bottom: 20,
  left: 20,
  right: 20,
  flexDirection: 'row',
  justifyContent: 'space-between',
});

const TouchableMediaView = ({
  onPress,
  participant,
  suffix,
  localAudioOn,
}: {
  onPress: () => void;
  participant: DailyParticipant;
  suffix: string;
  localAudioOn: boolean;
}) => (
  <TouchableOpacity onPress={onPress}>
    <DailyMediaViewWrapper
      videoTrack={participant.videoTrack ?? null}
      audioTrack={participant.audioTrack ?? null}
      objectFit={'cover'}
      zOrder={participant.local ? 1 : 0}
      mirror={participant.local}
    />
    <ParticipantName participant={participant} suffix={suffix} />
    <ParticipantAudio
      participant={participant}
      localAudioOn={localAudioOn}
      isOnThumbnail={false}
    />
  </TouchableOpacity>
);

const Session = () => {
  const {
    joinMeeting,
    leaveMeeting,
    toggleAudio,
    toggleVideo,
    hasAudio,
    hasVideo,
  } = useContext(DailyContext);
  const {
    params: {templeId},
  } = useRoute<RouteProp<TempleStackProps, 'Temple'>>();

  const {navigate} = useNavigation<ScreenNavigationProps>();
  const {t} = useTranslation(NS.SCREEN.TEMPLE);
  const {subscribeTemple, navigateToIndex, setActive} = useTemple();

  const temple = useRecoilValue(templeAtom);
  const participants = useRecoilValue(participantsSelector);
  const isLoading = useRecoilValue(videoSharingFields('isLoading'));
  const selectedParticipant = useRecoilValue(selectedParticipantSelector);
  const setSelectedParticipantId = useSetRecoilState(selectedParticipantIdAtom);

  useEffect(() => {
    if (temple?.url) {
      joinMeeting(temple?.url);
    }
  }, [joinMeeting, temple?.url]);

  useEffect(() => {
    const unsubscribe = subscribeTemple(templeId);
    return unsubscribe;
  }, [subscribeTemple, templeId]);

  const exitMeeting = async () => {
    await leaveMeeting();
    navigate(RootStackRoutes.TABS);
  };

  if (isLoading) {
    return (
      <LoadingView>
        <ActivityIndicator size="large" color={COLORS.BLACK} />
      </LoadingView>
    );
  }

  return (
    <MainViewContainer>
      <Spotlight>
        {!temple?.active && !selectedParticipant && (
          <ContentControls>
            <Button>{t('controls.start')}</Button>
          </ContentControls>
        )}
        {temple?.active && !selectedParticipant && (
          <>
            <Content contentIndex={temple.index} />
            <ContentControls>
              <SlideButton
                primary
                Icon={ChevronRight}
                title={t('controls.prev')}
                onPress={() => navigateToIndex(temple.index - 1)}
              />
              <SlideButton
                primary
                title={t('controls.next')}
                Icon={ChevronRight}
                onPress={() => navigateToIndex(temple.index + 1)}
              />
            </ContentControls>
          </>
        )}
        {selectedParticipant && (
          <SpotlightVideo>
            <TouchableMediaView
              onPress={() => setSelectedParticipantId(null)}
              participant={selectedParticipant}
              suffix={t('nameSuffix')}
              localAudioOn={hasAudio}
            />
          </SpotlightVideo>
        )}
      </Spotlight>
      {participants && (
        <Participants participants={participants} localAudioOn={hasAudio} />
      )}
      <Spacer16 />
      <SessionControls>
        <AudioToggleButton onPress={toggleAudio} active={hasAudio} />
        <Spacer12 />
        <VideoToggleButton onPress={toggleVideo} active={hasVideo} />
        <Spacer12 />
        <LeaveButton fill={COLORS.ROSE500} onPress={exitMeeting} />
      </SessionControls>
      <Spacer16 />
    </MainViewContainer>
  );
};

export default Session;
