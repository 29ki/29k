import {
  RouteProp,
  useIsFocused,
  useNavigation,
  useRoute,
} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import dayjs from 'dayjs';
import React, {useContext, useEffect, useRef, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {StyleSheet} from 'react-native';
import Video from 'react-native-video';
import {useRecoilValue} from 'recoil';
import styled from 'styled-components/native';
import ReactNativeHapticFeedback from 'react-native-haptic-feedback';

import Button from '../../common/components/Buttons/Button';
import Gutters from '../../common/components/Gutters/Gutters';
import {
  BottomSafeArea,
  Spacer16,
  Spacer8,
  TopSafeArea,
} from '../../common/components/Spacers/Spacer';
import {Body14} from '../../common/components/Typography/Body/Body';
import {COLORS} from '../../../../shared/src/constants/colors';
import {HKGroteskBold} from '../../common/constants/fonts';
import {SessionStackProps} from '../../lib/navigation/constants/routes';
import {SPACINGS} from '../../common/constants/spacings';
import NS from '../../lib/i18n/constants/namespaces';
import Counter from './components/Counter/Counter';
import useSessionExercise from './hooks/useSessionExercise';
import {participantsAtom, sessionAtom} from './state/state';
import useLeaveSession from './hooks/useLeaveSession';
import VideoBase from './components/VideoBase/VideoBase';
import useIsSessionFacilitator from './hooks/useIsSessionHost';
import AudioFader from './components/AudioFader/AudioFader';
import usePreventGoingBack from '../../lib/navigation/hooks/usePreventGoingBack';
import useUpdateSession from './hooks/useUpdateSession';
import HostNotes from './components/HostNotes/HostNotes';
import {DailyContext} from './DailyProvider';
import {DailyUserData} from '../../../../shared/src/types/Session';
import Screen from '../../common/components/Screen/Screen';
import IconButton from '../../common/components/Buttons/IconButton/IconButton';
import {ArrowLeftIcon} from '../../common/components/Icons';

type SessionNavigationProps = NativeStackNavigationProp<SessionStackProps>;

const VideoStyled = styled(VideoBase)({
  ...StyleSheet.absoluteFillObject,
});

const StatusItem = styled.View({
  flexDirection: 'row',
  alignItems: 'center',
});

const StatusText = styled(Body14)<{themeColor?: string}>(({themeColor}) => ({
  color: themeColor ? themeColor : COLORS.PURE_WHITE,
  fontFamily: HKGroteskBold,
}));

const Badge = styled.View<{themeColor?: string}>(({themeColor}) => ({
  backgroundColor: themeColor
    ? COLORS.BLACK_TRANSPARENT_15
    : COLORS.WHITE_TRANSPARENT,
  paddingVertical: SPACINGS.FOUR,
  paddingHorizontal: SPACINGS.EIGHT,
  borderRadius: SPACINGS.EIGHT,
}));

const PortalStatus = styled(Gutters)({
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
});

const Wrapper = styled.View({
  flex: 1,
  justifyContent: 'space-between',
});
const Content = styled.View({
  flex: 1,
  justifyContent: 'space-between',
});
const BackButton = styled(IconButton)({
  marginLeft: -SPACINGS.SIXTEEN,
});

const TopBar = styled(Gutters)({
  justifyContent: 'space-between',
  flexDirection: 'row',
});

const IntroPortal: React.FC = () => {
  const {
    params: {sessionId: sessionId},
  } = useRoute<RouteProp<SessionStackProps, 'IntroPortal'>>();
  const endVideoRef = useRef<Video>(null);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [joiningSession, setJoiningSession] = useState(false);
  const {t} = useTranslation(NS.SCREEN.PORTAL);
  const exercise = useSessionExercise();
  const session = useRecoilValue(sessionAtom);
  const participants = useRecoilValue(participantsAtom);
  const participantsCount = Object.keys(participants ?? {}).length;
  const isFacilitator = useIsSessionFacilitator();
  const {joinMeeting} = useContext(DailyContext);
  const {navigate} = useNavigation<SessionNavigationProps>();
  const isFocused = useIsFocused();
  const {setStarted} = useUpdateSession(sessionId);
  const {leaveSessionWithConfirm} = useLeaveSession();

  usePreventGoingBack(leaveSessionWithConfirm);

  useEffect(() => {
    joinMeeting({inPortal: true} as DailyUserData);
  }, [joinMeeting]);

  const introPortal = exercise?.introPortal;
  const themedText = exercise?.theme?.textColor;

  if (!introPortal) {
    return null;
  }

  const onEndVideoLoad = () => {
    endVideoRef.current?.seek(0);
  };

  const onEndVideoEnd = () => {
    if (joiningSession) {
      navigate('Session', {sessionId: sessionId});
    }
  };

  const onLoopVideoLoad = () => {
    setVideoLoaded(true);
  };

  const onLoopVideoEnd = () => {
    if (session?.started) {
      ReactNativeHapticFeedback.trigger('impactHeavy');
      setJoiningSession(true);
    }
  };

  return (
    <Screen noTopBar>
      {!isFacilitator && <TopSafeArea minSize={SPACINGS.SIXTEEN} />}
      {isFocused && introPortal.videoLoop?.audio && (
        <AudioFader
          source={introPortal.videoLoop.audio}
          repeat
          paused={!videoLoaded}
          volume={!joiningSession ? 1 : 0}
          duration={!joiningSession ? 20000 : 5000}
        />
      )}
      <VideoStyled
        ref={endVideoRef}
        onLoad={onEndVideoLoad}
        onEnd={onEndVideoEnd}
        paused={!joiningSession}
        source={{uri: introPortal.videoEnd?.source}}
        resizeMode="cover"
        poster={introPortal.videoEnd?.preview}
        posterResizeMode="cover"
        allowsExternalPlayback={false}
      />

      {!joiningSession && (
        <VideoStyled
          onLoad={onLoopVideoLoad}
          onEnd={onLoopVideoEnd}
          repeat={!session?.started}
          source={{uri: introPortal.videoLoop?.source}}
          resizeMode="cover"
          poster={introPortal.videoLoop?.preview}
          posterResizeMode="cover"
          allowsExternalPlayback={false}
        />
      )}

      {isFacilitator && (
        <>
          <HostNotes introPortal />
          <Spacer16 />
        </>
      )}
      <Wrapper>
        {isFocused && (
          <Content>
            <TopBar>
              <BackButton
                noBackground
                onPress={leaveSessionWithConfirm}
                Icon={ArrowLeftIcon}
                fill={themedText}
              />
              {__DEV__ && session?.started && (
                <Button
                  small
                  onPress={() => navigate('Session', {sessionId: sessionId})}>
                  {t('skipPortal')}
                </Button>
              )}
              {isFacilitator && (
                <Button small disabled={session?.started} onPress={setStarted}>
                  {session?.started ? t('sessionStarted') : t('startSession')}
                </Button>
              )}
            </TopBar>

            <PortalStatus>
              <StatusItem>
                <StatusText themeColor={themedText}>
                  {t('counterLabel.soon')}
                </StatusText>

                <Spacer8 />
                <Badge themeColor={themedText}>
                  <StatusText themeColor={themedText}>
                    <Counter
                      startTime={dayjs(session?.startTime.toDate())}
                      starting={session?.started}
                    />
                  </StatusText>
                </Badge>
              </StatusItem>

              {participantsCount > 1 && (
                <StatusItem>
                  <StatusText themeColor={themedText}>
                    {t('participants')}
                  </StatusText>
                  <Spacer8 />
                  <Badge themeColor={themedText}>
                    <StatusText themeColor={themedText}>
                      {participantsCount}
                    </StatusText>
                  </Badge>
                </StatusItem>
              )}
            </PortalStatus>
          </Content>
        )}
      </Wrapper>

      <BottomSafeArea minSize={SPACINGS.SIXTEEN} />
    </Screen>
  );
};

export default IntroPortal;
