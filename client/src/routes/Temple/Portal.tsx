import {RouteProp, useNavigation, useRoute} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import dayjs from 'dayjs';
import React, {useEffect, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {StyleSheet} from 'react-native';
import Animated, {FadeOut} from 'react-native-reanimated';
import Video from 'react-native-video';
import {useRecoilValue} from 'recoil';
import styled from 'styled-components/native';
import Button from '../../common/components/Buttons/Button';
import IconButton from '../../common/components/Buttons/IconButton/IconButton';

import Gutters from '../../common/components/Gutters/Gutters';
import {ArrowLeftIcon} from '../../common/components/Icons';
import {
  BottomSafeArea,
  Spacer8,
  TopSafeArea,
} from '../../common/components/Spacers/Spacer';
import {B3} from '../../common/components/Typography/Text/Text';
import {COLORS} from '../../common/constants/colors';
import {HKGroteskBold} from '../../common/constants/fonts';
import {TempleStackProps} from '../../common/constants/routes';
import {SPACINGS} from '../../common/constants/spacings';
import NS from '../../lib/i18n/constants/namespaces';
import {userAtom} from '../../lib/user/state/state';
import * as templeApi from '../Temples/api/temple';
import Counter from './components/Counter/Counter';
import useTempleExercise from './hooks/useTempleExercise';
import {participantsSelector, templeAtom} from './state/state';

type TempleNavigationProps = NativeStackNavigationProp<TempleStackProps>;

const dayjsTime = dayjs().add(59, 'seconds');

const VideoStyled = styled(Video)({
  ...StyleSheet.absoluteFillObject,
  flex: 1,
});

const StatusText = styled(B3)({
  color: COLORS.WHITE,
});

const StatusItem = styled.View({
  flexDirection: 'row',
  alignItems: 'center',
  flex: 1,
});

const BadgeText = styled(StatusText)({
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

const TopBar = styled(Gutters)({
  justifyContent: 'space-between',
  flexDirection: 'row',
  paddingVertical: SPACINGS.EIGHT,
});

const StartButton = styled(Button)({
  backgroundColor: COLORS.GREEN,
});

const BackButton = styled(IconButton)({
  marginLeft: -SPACINGS.TWELVE,
});

const Portal: React.FC = () => {
  const {
    params: {templeId},
  } = useRoute<RouteProp<TempleStackProps, 'Portal'>>();
  const [now, setNow] = useState(dayjs());
  const [joiningTemple, setJoiningTemple] = useState(false);
  const {t} = useTranslation(NS.SCREEN.PORTAL);
  const exercise = useTempleExercise();
  const temple = useRecoilValue(templeAtom);
  const introPortal = exercise?.introPortal;
  const participants = useRecoilValue(participantsSelector);
  const participantsCount = participants.length;
  const user = useRecoilValue(userAtom);

  const {goBack, navigate} = useNavigation<TempleNavigationProps>();

  useEffect(() => {
    const interval = setInterval(() => {
      setNow(dayjs());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  if (!introPortal) {
    return null;
  }

  return (
    <>
      <TopSafeArea />
      <VideoStyled
        onEnd={() => navigate('Temple', {templeId})}
        paused={!joiningTemple}
        source={{uri: introPortal.content.videoEnd?.source}}
        mixWithOthers="mix"
        disableFocus
      />
      {!joiningTemple && (
        <VideoStyled
          onEnd={() => {
            if (temple?.started) {
              setJoiningTemple(true);
            }
          }}
          repeat={!temple?.started}
          source={{uri: introPortal.content.videoLoop?.source}}
          mixWithOthers="mix"
          disableFocus
        />
      )}
      <Wrapper>
        {introPortal.type === 'video' && (
          <>
            <TopBar>
              <BackButton noBackground onPress={goBack} Icon={ArrowLeftIcon} />
              {temple?.facilitator === user?.uid && !temple?.started && (
                <Animated.View exiting={FadeOut.duration(1500)}>
                  <StartButton
                    disabled={temple?.started}
                    onPress={() => {
                      templeApi.updateTemple(templeId, {started: true});
                    }}>
                    {t('startSession')}
                  </StartButton>
                </Animated.View>
              )}
            </TopBar>

            <PortalStatus>
              <StatusItem>
                <StatusText>{t('counterLabel.soon')}</StatusText>

                <Spacer8 />
                <Badge>
                  <Counter
                    startTime={dayjsTime}
                    now={now}
                    starting={joiningTemple}
                  />
                </Badge>
              </StatusItem>

              <StatusItem>
                {participantsCount > 1 && (
                  <>
                    <StatusText>{t('participants')}</StatusText>
                    <Spacer8 />
                    <Badge>
                      <BadgeText>{participantsCount}</BadgeText>
                    </Badge>
                  </>
                )}
              </StatusItem>
            </PortalStatus>
          </>
        )}
      </Wrapper>
      <BottomSafeArea />
    </>
  );
};

export default Portal;
