import {RouteProp, useNavigation, useRoute} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
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
import useTempleExercise from './hooks/useTempleExercise';
import {participantsSelector} from './state/state';

type TempleNavigationProps = NativeStackNavigationProp<TempleStackProps>;

const TIME_TO_START = new Date(
  new Date().getTime() + (1 * 60000) / 2,
).getTime();

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
  const [now, setNow] = useState(Date.now());
  const [fade, setFade] = useState(false);
  const {t} = useTranslation(NS.SCREEN.PORTAL);
  const exercise = useTempleExercise();
  const introPortal = exercise?.introPortal;
  const participants = useRecoilValue(participantsSelector);
  const participantsCount = participants.length;

  const {navigate} = useNavigation<TempleNavigationProps>();

  useEffect(() => {
    const interval = setInterval(() => {
      setNow(Date.now());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (TIME_TO_START <= now) {
      setFade(true);
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
            paused={!fade}
            source={{uri: introPortal.content.videoEnd?.source}}
          />
          {!fade && (
            <VideoStyled
              repeat
              source={{uri: introPortal.content.videoLoop?.source}}
            />
          )}
          <PortalStaus>
            <StatusItem>
              <StatusText>
                {t(
                  `counterLabel.${
                    TIME_TO_START <= now + 60000 ? 'soon' : 'counting'
                  }`,
                )}
              </StatusText>

              <Spacer8 />
              <Badge>
                <BadgeText>
                  {TIME_TO_START - now <= 60000 &&
                    TIME_TO_START - now > 0 &&
                    t('counterValue.shortly')}
                  {TIME_TO_START <= now && t('counterValue.now')}
                  {TIME_TO_START >= now + 60000 &&
                    new Date(TIME_TO_START - now).getMinutes() +
                      'm ' +
                      new Date(TIME_TO_START - now).getSeconds() +
                      's'}
                </BadgeText>
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
