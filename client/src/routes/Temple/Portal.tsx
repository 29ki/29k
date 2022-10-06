import {
  RouteProp,
  useIsFocused,
  useNavigation,
  useRoute,
} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import dayjs from 'dayjs';
import React, {useRef, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {StyleSheet} from 'react-native';
import Video from 'react-native-video';
import {useRecoilValue} from 'recoil';
import styled from 'styled-components/native';
import ReactNativeHapticFeedback from 'react-native-haptic-feedback';

import Button from '../../common/components/Buttons/Button';
import IconButton from '../../common/components/Buttons/IconButton/IconButton';
import Gutters from '../../common/components/Gutters/Gutters';
import {ArrowLeftIcon} from '../../common/components/Icons';
import {
  BottomSafeArea,
  Spacer8,
  TopSafeArea,
} from '../../common/components/Spacers/Spacer';
import {Body14} from '../../common/components/Typography/Body/Body';
import {COLORS} from '../../../../shared/src/constants/colors';
import {HKGroteskBold} from '../../common/constants/fonts';
import {TempleStackProps} from '../../common/constants/routes';
import {SPACINGS} from '../../common/constants/spacings';
import NS from '../../lib/i18n/constants/namespaces';
import * as templeApi from '../Temples/api/temple';
import Counter from './components/Counter/Counter';
import useTempleExercise from './hooks/useTempleExercise';
import usePreventTempleLeave from './hooks/usePreventTempleLeave';
import {participantsAtom, templeAtom} from './state/state';
import useLeaveTemple from './hooks/useLeaveTemple';
import VideoBase from './components/VideoBase/VideoBase';
import useIsTempleFacilitator from './hooks/useIsTempleFacilitator';
import AudioFader from './components/AudioFader/AudioFader';

type TempleNavigationProps = NativeStackNavigationProp<TempleStackProps>;

const VideoStyled = styled(VideoBase)({
  ...StyleSheet.absoluteFillObject,
  flex: 1,
});

const StatusItem = styled.View({
  flexDirection: 'row',
  alignItems: 'center',
});

const StatusText = styled(Body14)({
  color: COLORS.PURE_WHITE,
  fontFamily: HKGroteskBold,
});

const Badge = styled.View({
  backgroundColor: COLORS.WHITE_TRANSPARENT,
  paddingVertical: SPACINGS.FOUR,
  paddingHorizontal: SPACINGS.EIGHT,
  borderRadius: SPACINGS.EIGHT,
});

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

const TopBar = styled(Gutters)({
  justifyContent: 'space-between',
  alignItems: 'center',
  flexDirection: 'row',
});

const BackButton = styled(IconButton)({
  marginLeft: -SPACINGS.SIXTEEN,
});

const Portal: React.FC = () => {
  const {
    params: {templeId},
  } = useRoute<RouteProp<TempleStackProps, 'Portal'>>();
  const endVideoRef = useRef<Video>(null);
  const [joiningTemple, setJoiningTemple] = useState(false);
  const {t} = useTranslation(NS.SCREEN.PORTAL);
  const exercise = useTempleExercise();
  const temple = useRecoilValue(templeAtom);
  const participants = useRecoilValue(participantsAtom);
  const participantsCount = Object.keys(participants ?? {}).length;
  const isFacilitator = useIsTempleFacilitator();
  const {navigate} = useNavigation<TempleNavigationProps>();
  const leaveTemple = useLeaveTemple();
  const isFocused = useIsFocused();

  usePreventTempleLeave();

  const introPortal = exercise?.introPortal;

  if (!introPortal) {
    return null;
  }

  const onEndVideoLoad = () => {
    endVideoRef.current?.seek(0);
  };

  const onEndVideoEnd = () => {
    if (joiningTemple) {
      navigate('Temple', {templeId});
    }
  };

  const onLoopVideoEnd = () => {
    if (temple?.started) {
      ReactNativeHapticFeedback.trigger('impactHeavy');
      setJoiningTemple(true);
    }
  };

  return (
    <>
      <TopSafeArea minSize={SPACINGS.SIXTEEN} />
      {isFocused && introPortal.videoLoop?.audio && (
        <AudioFader
          source={introPortal.videoLoop.audio}
          repeat
          mute={joiningTemple}
        />
      )}

      <VideoStyled
        ref={endVideoRef}
        onLoad={onEndVideoLoad}
        onEnd={onEndVideoEnd}
        paused={!joiningTemple}
        source={{uri: introPortal.videoEnd?.source}}
        resizeMode="cover"
        poster={introPortal.videoEnd?.preview}
        posterResizeMode="cover"
        allowsExternalPlayback={false}
      />

      {!joiningTemple && (
        <VideoStyled
          onEnd={onLoopVideoEnd}
          repeat={!temple?.started}
          source={{uri: introPortal.videoLoop?.source}}
          resizeMode="cover"
          poster={introPortal.videoLoop?.preview}
          posterResizeMode="cover"
          allowsExternalPlayback={false}
        />
      )}
      <Wrapper>
        {isFocused && (
          <Content>
            <TopBar>
              <BackButton
                noBackground
                onPress={leaveTemple}
                Icon={ArrowLeftIcon}
              />
              {__DEV__ && temple?.started && (
                <Button small onPress={() => navigate('Temple', {templeId})}>
                  {t('skipPortal')}
                </Button>
              )}
              {isFacilitator && (
                <Button
                  small
                  disabled={temple?.started}
                  onPress={() => {
                    templeApi.updateTemple(templeId, {started: true});
                  }}>
                  {temple?.started ? t('sessionStarted') : t('startSession')}
                </Button>
              )}
            </TopBar>

            <PortalStatus>
              <StatusItem>
                <StatusText>{t('counterLabel.soon')}</StatusText>

                <Spacer8 />
                <Badge>
                  <StatusText>
                    <Counter
                      startTime={dayjs(temple?.startTime.toDate())}
                      starting={temple?.started}
                    />
                  </StatusText>
                </Badge>
              </StatusItem>

              {participantsCount > 0 && (
                <StatusItem>
                  <StatusText>{t('participants')}</StatusText>
                  <Spacer8 />
                  <Badge>
                    <StatusText>{participantsCount}</StatusText>
                  </Badge>
                </StatusItem>
              )}
            </PortalStatus>
          </Content>
        )}
      </Wrapper>
      <BottomSafeArea minSize={SPACINGS.SIXTEEN} />
    </>
  );
};

export default Portal;
