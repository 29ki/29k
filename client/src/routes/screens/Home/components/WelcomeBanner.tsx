import dayjs from 'dayjs';
import React from 'react';
import styled from 'styled-components/native';
import {useTranslation} from 'react-i18next';
import AnimatedLottieView, {AnimationObject} from 'lottie-react-native';
import enMorning from '../../../../assets/animations/welcome/en-morning.json';
import enAfternoon from '../../../../assets/animations/welcome/en-afternoon.json';
import enEvening from '../../../../assets/animations/welcome/en-evening.json';
import enWelcome from '../../../../assets/animations/welcome/en-welcome.json';

type Banners = {
  [language: string]: {
    morning: AnimationObject;
    afternoon: AnimationObject;
    evening: AnimationObject;
    welcome: AnimationObject;
  };
};

const banners: Banners = {
  en: {
    morning: enMorning,
    afternoon: enAfternoon,
    evening: enEvening,
    welcome: enWelcome,
  },
};

const Animation = styled(AnimatedLottieView)({
  aspectRatio: 1125 / 400,
});

const WelcomeBanner = () => {
  const {i18n} = useTranslation();

  const now = dayjs();

  if (i18n.resolvedLanguage && i18n.resolvedLanguage in banners) {
    let banner = banners[i18n.resolvedLanguage].welcome;

    if (now.hour() >= 5 && now.hour() < 10) {
      banner = banners[i18n.resolvedLanguage].morning;
    }

    if (now.hour() >= 14 && now.hour() < 18) {
      banner = banners[i18n.resolvedLanguage].afternoon;
    }

    if (now.hour() >= 18 && now.hour() <= 23) {
      banner = banners[i18n.resolvedLanguage].evening;
    }

    return <Animation source={banner} autoPlay loop={false} />;
  }

  return null;
};

export default WelcomeBanner;
