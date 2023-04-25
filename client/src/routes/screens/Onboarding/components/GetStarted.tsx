import React from 'react';
import styled from 'styled-components/native';
import {useTranslation} from 'react-i18next';
import {
  LogoIcon,
  JourneyIcon,
  ExploreIcon,
} from '../../../../lib/components/Icons';
import {Spacer16, Spacer40} from '../../../../lib/components/Spacers/Spacer';
import {
  Body14,
  Body18,
  BodyBold,
} from '../../../../lib/components/Typography/Body/Body';
import BackgroundGradient from './BackgroundGradient';
import Gutters from '../../../../lib/components/Gutters/Gutters';
import {COLORS} from '../../../../../../shared/src/constants/colors';

const Background = styled(BackgroundGradient)({
  width: '120%',
  height: '140%',
});

const Tabs = styled(Gutters)({
  position: 'absolute',
  width: '100%',
  bottom: '35%',
  alignItems: 'center',
});

const Tab = styled.View({
  width: 80,
  height: 80,
  paddingVertical: 16,
  alignItems: 'center',
  justifyContent: 'center',
  borderRadius: 22,
  backgroundColor: COLORS.CREAM,
});

const Text = styled(Body18)({
  color: COLORS.PURE_WHITE,
  textAlign: 'center',
});

const GetStarted = () => {
  const {t} = useTranslation('Screen.Onboarding');

  return (
    <>
      <Background />
      <Tabs>
        <Tab>
          <ExploreIcon />
          <Body14>
            <BodyBold>{t('explore', {ns: 'Component.Tabs'})}</BodyBold>
          </Body14>
        </Tab>
        <Spacer16 />
        <Text>{t('page4.sessions__text')}</Text>
        <Spacer40 />

        <Tab>
          <JourneyIcon />
          <Body14>
            <BodyBold>{t('journey', {ns: 'Component.Tabs'})}</BodyBold>
          </Body14>
        </Tab>
        <Spacer16 />
        <Text>{t('page4.journey__text')}</Text>
      </Tabs>
    </>
  );
};

export default GetStarted;
