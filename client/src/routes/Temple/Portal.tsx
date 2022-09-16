import {RouteProp, useNavigation, useRoute} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import dayjs from 'dayjs';
import React, {useEffect, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {StyleSheet} from 'react-native';
import Video from 'react-native-video';
import {useRecoilValue} from 'recoil';
import styled from 'styled-components/native';

import Gutters from '../../common/components/Gutters/Gutters';
import {BottomSafeArea, Spacer8} from '../../common/components/Spacers/Spacer';
import {B3} from '../../common/components/Typography/Text/Text';
import {COLORS} from '../../common/constants/colors';
import {HKGroteskBold} from '../../common/constants/fonts';
import {TempleStackProps} from '../../common/constants/routes';
import {SPACINGS} from '../../common/constants/spacings';
import NS from '../../lib/i18n/constants/namespaces';
import Counter from './components/Counter/Counter';
import useTempleExercise from './hooks/useTempleExercise';
import {participantsSelector} from './state/state';

type TempleNavigationProps = NativeStackNavigationProp<TempleStackProps>;

const dayjsTime = dayjs().add(3, 'minutes');

const VideoStyled = styled(Video)<{fadeOut?: boolean}>(({fadeOut}) => ({
  ...StyleSheet.absoluteFillObject,
  flex: 1,
  opacity: fadeOut ? 0 : 1,
}));

const StatusText = styled(B3)({
  color: COLORS.WHITE,
});

const StatusItem = styled.View({
  flexDirection: 'row',
  alignItems: 'center',
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

const PortalStaus = styled.View({
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
});

const Wrapper = styled(Gutters)({
  flex: 1,
  justifyContent: 'flex-end',
});

const Portal: React.FC = () => {
  const {
    params: {templeId},
  } = useRoute<RouteProp<TempleStackProps, 'Portal'>>();
  const [now, setNow] = useState(dayjs());
  const [startTransition, setStartTransition] = useState(false);
  const [joiningTemple, setJoiningTemple] = useState(false);
  const {t} = useTranslation(NS.SCREEN.PORTAL);
  const exercise = useTempleExercise();
  const introPortal = exercise?.introPortal;
  const participants = useRecoilValue(participantsSelector);
  const participantsCount = participants.length;

  const {navigate} = useNavigation<TempleNavigationProps>();

  useEffect(() => {
    const interval = setInterval(() => {
      setNow(dayjs());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (now.isAfter(dayjsTime)) {
      setStartTransition(true);
    }
  }, [now]);

  if (!introPortal) {
    return null;
  }

  return (
    <Wrapper>
      {introPortal.type === 'video' && (
        <>
          <VideoStyled
            onEnd={() => navigate('Temple', {templeId})}
            paused={!joiningTemple}
            source={{uri: introPortal.content.videoEnd?.source}}
          />
          <VideoStyled
            onEnd={() => setJoiningTemple(true)}
            repeat={!startTransition}
            source={{uri: introPortal.content.videoLoop?.source}}
            fadeOut={joiningTemple}
          />
          <PortalStaus>
            <StatusItem>
              <StatusText>{t('counterLabel.soon')}</StatusText>

              <Spacer8 />
              <Badge>
                <Counter startTime={dayjsTime} now={now} />
              </Badge>
            </StatusItem>
            {participantsCount > 1 && (
              <StatusItem>
                <StatusText>{t('participants')}</StatusText>
                <Spacer8 />
                <Badge>
                  <BadgeText>{participantsCount}</BadgeText>
                </Badge>
              </StatusItem>
            )}
          </PortalStaus>
        </>
      )}
      <BottomSafeArea />
    </Wrapper>
  );
};

export default Portal;
