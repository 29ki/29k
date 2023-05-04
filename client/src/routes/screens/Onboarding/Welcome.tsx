import React, {useCallback, useEffect} from 'react';
import {StatusBar, Platform, Dimensions} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import Svg, {
  SvgProps,
  Circle,
  Defs,
  RadialGradient,
  Stop,
} from 'react-native-svg';
import styled from 'styled-components/native';
import Gutters from '../../../lib/components/Gutters/Gutters';
import {
  Display24,
  Display36,
} from '../../../lib/components/Typography/Display/Display';
import {COLORS} from '../../../../../shared/src/constants/colors';
import {useTranslation} from 'react-i18next';
import Button from '../../../lib/components/Buttons/Button';
import {BodyBold} from '../../../lib/components/Typography/Body/Body';
import {PlayfairDisplayMedium} from '../../../lib/constants/fonts';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {AppStackProps} from '../../../lib/navigation/constants/routes';
import BackgroundGradient from './components/BackgroundGradient';
import Footer from './components/Footer';

const {width: WINDOW_WIDTH, height: WINDOW_HEIGHT} = Dimensions.get('window');

const BACKGROUND_HEIGHT = WINDOW_HEIGHT;
const BACKGROUND_WIDTH = WINDOW_HEIGHT * 1.75;

const Background = styled.Image.attrs({
  source: {uri: Platform.select({android: 'forest', ios: 'forest.jpg'})},
})({
  position: 'absolute',
  top: 0,
  left: -(BACKGROUND_WIDTH * 0.565 - WINDOW_WIDTH / 2),
  height: BACKGROUND_HEIGHT,
  width: BACKGROUND_WIDTH,
});

const Sun = (props: SvgProps) => (
  <Svg width="100%" height="100%" viewBox="0 0 375 499" fill="none" {...props}>
    <Circle cx={181.5} cy={249.5} r={249.5} fill="url(#a)" />
    <Defs>
      <RadialGradient
        id="a"
        cx={0}
        cy={0}
        r={1}
        gradientTransform="rotate(90 -34 215.5) scale(249.5)"
        gradientUnits="userSpaceOnUse">
        <Stop offset={0.078} stopColor="#FFFAE6" />
        <Stop offset={0.167} stopColor="#FFF1B7" />
        <Stop offset={0.411} stopColor="#FFEA94" stopOpacity={0.72} />
        <Stop offset={1} stopColor="#FFF8DA" stopOpacity={0} />
      </RadialGradient>
    </Defs>
  </Svg>
);

const SUNSET_WIDTH = WINDOW_WIDTH * 1.33;
const SUNSET_HEIGHT = SUNSET_WIDTH * (499 / 375);

const Sunrise = styled(Animated.View)({
  position: 'absolute',
  width: SUNSET_WIDTH,
  height: SUNSET_HEIGHT,
  left: (WINDOW_WIDTH - SUNSET_WIDTH) / 2,
  top: (WINDOW_HEIGHT - SUNSET_HEIGHT) / 2,
});

const HeadingBackground = styled(BackgroundGradient).attrs({color: '#3F4E3A'})({
  position: 'absolute',
  alignSelf: 'center',
  bottom: '21%',
  width: 510,
  height: 260,
});

const HeadingWrapper = styled(Gutters)({
  position: 'absolute',
  bottom: '31%',
  width: '100%',
  alignItems: 'center',
  justifyContent: 'center',
});

const Heading1 = styled(Display24)({
  textAlign: 'center',
  color: COLORS.PURE_WHITE,
});

const Heading2 = styled(Display36)({
  fontFamily: PlayfairDisplayMedium,
  fontSize: 44,
  lineHeight: 59,
  color: COLORS.PURE_WHITE,
});

const Welcome = () => {
  const {t} = useTranslation('Screen.Onboarding');
  const {navigate} = useNavigation<NativeStackNavigationProp<AppStackProps>>();

  const sunriseY = useSharedValue(0);

  const sunriseStyle = useAnimatedStyle(() => ({
    transform: [{translateY: sunriseY.value}],
  }));

  useEffect(() => {
    sunriseY.value = withTiming(-(WINDOW_HEIGHT / 4), {
      duration: 10000,
    });
  }, [sunriseY]);

  const onButtonPress = useCallback(() => {
    navigate('Onboarding');
  }, [navigate]);

  return (
    <>
      <StatusBar hidden />
      <Background />
      <HeadingBackground />
      <Sunrise style={sunriseStyle}>
        <Sun />
      </Sunrise>
      <HeadingWrapper>
        <Heading1>{t('start.heading1')}</Heading1>
        <Heading2>{t('start.heading2')}</Heading2>
      </HeadingWrapper>
      <Footer>
        <Button onPress={onButtonPress}>
          <BodyBold>{t('continueButton')}</BodyBold>
        </Button>
      </Footer>
    </>
  );
};

export default Welcome;
