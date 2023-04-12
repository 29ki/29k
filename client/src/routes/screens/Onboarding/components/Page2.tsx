import React from 'react';
import {useTranslation} from 'react-i18next';
import Gutters from '../../../../lib/components/Gutters/Gutters';
import Heading from './Heading';
import VideoLooper from '../../../../lib/components/VideoLooper/VideoLooper';
import styled from 'styled-components/native';
import {COLORS} from '../../../../../../shared/src/constants/colors';
import LinearGradient from 'react-native-linear-gradient';
import {Body14} from '../../../../lib/components/Typography/Body/Body';
import {Spacer32} from '../../../../lib/components/Spacers/Spacer';

const Squares = styled.View({
  aspectRatio: 1,
  zIndex: 1,
});

const Square = styled.View({
  position: 'absolute',
  width: '37%',
  aspectRatio: 1,
  shadowColor: '#000',
  shadowOffset: '0 12px',
  shadowOpacity: 0.58,
  shadowRadius: 16.0,
});

const Square1 = styled(Square)({
  right: '38%',
  bottom: '58%',
  zIndex: 3,
});

const Square2 = styled(Square)({
  left: '50%',
  top: '32%',
  zIndex: 2,
});

const Square3 = styled(Square)({
  right: '45%',
  top: '50%',
  zIndex: 1,
});

const Frame = styled.View({
  width: '100%',
  height: '100%',
  borderRadius: 14,
  backgroundColor: COLORS.BLACK,
  overflow: 'hidden',
  elevation: 24,
});

const NameWrapper = styled(LinearGradient).attrs({
  colors: ['rgba(0, 0, 0, 0)', 'rgba(0, 0, 0, 1)'],
})({
  position: 'absolute',
  bottom: 0,
  width: '100%',
  height: 42,
});

const Name = styled(Body14)({
  position: 'absolute',
  left: 14,
  bottom: 8,
  color: COLORS.PURE_WHITE,
});

const Video = styled(VideoLooper).attrs({
  paused: false,
  repeat: true,
  muted: true,
})({});

const Page2 = () => {
  const {t} = useTranslation('Screen.Onboarding');

  return (
    <>
      <Squares>
        <Square1>
          <Frame>
            <Video
              sources={[
                {
                  source: 'onboarding_person1.mp4',
                  repeat: true,
                },
              ]}
            />
            <NameWrapper>
              <Name>{t('page2.name1')}</Name>
            </NameWrapper>
          </Frame>
        </Square1>
        <Square2>
          <Frame>
            <Video
              sources={[
                {
                  source: 'onboarding_person2.mp4',
                  repeat: true,
                },
              ]}
            />
            <NameWrapper>
              <Name>{t('page2.name2')}</Name>
            </NameWrapper>
          </Frame>
        </Square2>
        <Square3>
          <Frame>
            <Video
              sources={[
                {
                  source: 'onboarding_person3.mp4',
                  repeat: true,
                },
              ]}
            />
            <NameWrapper>
              <Name>{t('page2.name3')}</Name>
            </NameWrapper>
          </Frame>
        </Square3>
      </Squares>
      <Spacer32 />
      <Gutters>
        <Heading>{t('page2.heading__text')}</Heading>
      </Gutters>
    </>
  );
};

export default Page2;
