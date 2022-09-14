import React from 'react';
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
import {SPACINGS} from '../../common/constants/spacings';
import NS from '../../lib/i18n/constants/namespaces';
import useTempleExercise from './hooks/useTempleExercise';
import {participantsSelector} from './state/state';

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
  const {t} = useTranslation(NS.SCREEN.PORTAL);
  const exercise = useTempleExercise();
  const introPortal = exercise?.introPortal;
  const participants = useRecoilValue(participantsSelector);
  const participantsCount = participants.length;

  if (!introPortal) {
    return null;
  }

  return (
    <Wrapper>
      {introPortal.type === 'video' && (
        <>
          <VideoStyled
            paused
            source={{uri: introPortal.content.videoEnd?.source}}
          />
          <VideoStyled
            onEnd={() => {
              console.log('ended');
            }}
            repeat
            source={{uri: introPortal.content.videoLoop?.source}}
          />
          <PortalStaus>
            <StatusItem>
              <StatusText>{t('counter')}</StatusText>
              <Spacer8 />
              <Badge>
                <BadgeText>1 min 5 sec</BadgeText>
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
