import React, {Fragment, useCallback, useEffect, useRef, useState} from 'react';
import {
  Dimensions,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Platform,
  StatusBar,
  StyleSheet,
} from 'react-native';
import Animated, {
  interpolate,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import {Extrapolate} from 'react-native-reanimated';
import styled from 'styled-components/native';
import {COLORS} from '../../../../../shared/src/constants/colors';
import {
  Spacer16,
  Spacer24,
  Spacer4,
  Spacer40,
} from '../../../lib/components/Spacers/Spacer';
import Page1 from './components/Page1';
import Page2 from './components/Page2';
import Page3 from './components/Page3';
import {
  Body14,
  Body18,
  BodyBold,
} from '../../../lib/components/Typography/Body/Body';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {AppStackProps} from '../../../lib/navigation/constants/routes';
import Button from '../../../lib/components/Buttons/Button';
import {useTranslation} from 'react-i18next';
import useAppState from '../../../lib/appState/state/state';
import {
  ArrowRightIcon,
  JourneyIcon,
  LogoIcon,
} from '../../../lib/components/Icons';
import Gutters from '../../../lib/components/Gutters/Gutters';
import Markdown from '../../../lib/components/Typography/Markdown/Markdown';

const WINDOW_WIDTH = Dimensions.get('window').width;

const Background = styled(Animated.Image).attrs({
  source: {uri: Platform.select({android: 'forest', ios: 'forest.jpg'})},
})({
  ...StyleSheet.absoluteFillObject,
});

const Screens = styled(Animated.View)({
  position: 'absolute',
  width: WINDOW_WIDTH * 2,
  height: '100%',
  left: 0,
  top: 0,
  flexDirection: 'row',
});

const ScrollView = styled(Animated.ScrollView).attrs({
  horizontal: true,
  pagingEnabled: true,
})({
  ...StyleSheet.absoluteFillObject,
});

const Screen = styled.View({
  width: WINDOW_WIDTH,
  height: '100%',
});

const Page = styled.View({
  width: WINDOW_WIDTH,
  height: '75%',
  justifyContent: 'flex-end',
});

const Dots = styled.View({
  position: 'absolute',
  left: 0,
  right: 0,
  top: '80%',
  justifyContent: 'center',
  flexDirection: 'row',
});

const Dot = styled(Animated.View)({
  width: 10,
  height: 10,
  borderRadius: 5,
  backgroundColor: COLORS.WHITE,
});

const AnimatedDot: React.FC<{active: boolean}> = ({active}) => {
  const opacity = useSharedValue(active ? 1 : 0.4);

  useEffect(() => {
    opacity.value = withTiming(active ? 1 : 0.4, {duration: 400});
  }, [opacity, active]);

  const style = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  return <Dot style={style} />;
};

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

const ContinueButton = styled(Button)({
  position: 'absolute',
  bottom: '8%',
  alignSelf: 'center',
});

const Onboarding = () => {
  const {t} = useTranslation('Screen.Onboarding');
  const {navigate} = useNavigation<NativeStackNavigationProp<AppStackProps>>();
  const setSettings = useAppState(state => state.setSettings);

  const scrollViewRef = useRef<Animated.ScrollView>(null);
  const [pageCount, setPageCount] = useState(0);
  const [pageIndex, setPageIndex] = useState(0);

  const screensX = useSharedValue(0);
  const scrollX = useSharedValue(0);
  const scrollWidth = useSharedValue(0);

  const onContentLayout = useCallback(
    (width: number) => {
      scrollWidth.value = width + WINDOW_WIDTH;
      setPageCount(Math.round(width / WINDOW_WIDTH));
    },
    [scrollWidth, setPageCount],
  );

  const onScroll = useAnimatedScrollHandler({
    onScroll: e => {
      scrollX.value = e.contentOffset.x;
    },
  });

  const onMomentumScrollEnd = useCallback(
    (e: NativeSyntheticEvent<NativeScrollEvent>) => {
      setPageIndex(Math.round(e.nativeEvent.contentOffset.x / WINDOW_WIDTH));
    },
    [setPageIndex],
  );

  const screensStyle = useAnimatedStyle(() => ({
    transform: [
      {
        translateX: screensX.value,
      },
    ],
  }));

  const backgroundStyle = useAnimatedStyle(() => ({
    width: scrollWidth.value,
    transform: [
      {
        translateX: interpolate(
          scrollX.value,
          [0, scrollWidth.value - WINDOW_WIDTH],
          [0, -(scrollWidth.value - WINDOW_WIDTH)],
          Extrapolate.CLAMP,
        ),
      },
    ],
  }));

  const onContinuePress = useCallback(() => {
    screensX.value = withTiming(screensX.value - WINDOW_WIDTH, {duration: 400});
  }, [screensX]);

  const onGetStartedPress = useCallback(() => {
    setSettings({showOnboarding: false});
    navigate('Tabs');
  }, [navigate, setSettings]);

  return (
    <>
      <StatusBar hidden />
      <Screens style={screensStyle}>
        <Background style={backgroundStyle} />
        <Screen>
          <ScrollView
            ref={scrollViewRef}
            onContentSizeChange={onContentLayout}
            onScroll={onScroll}
            onMomentumScrollEnd={onMomentumScrollEnd}
            scrollEventThrottle={16}>
            <Page>
              <Page1 />
            </Page>
            <Page>
              <Page2 />
            </Page>
            <Page>
              <Page3 />
            </Page>
          </ScrollView>
          <Dots>
            <Spacer4 />
            {Array(pageCount)
              .fill(null)
              .map((_, index) => (
                <Fragment key={index}>
                  <AnimatedDot active={index === pageIndex} />
                  <Spacer4 />
                </Fragment>
              ))}
          </Dots>
          <ContinueButton onPress={onContinuePress}>
            <BodyBold>{t('continueButton')}</BodyBold>
          </ContinueButton>
        </Screen>
        <Screen>
          <Tabs>
            <Tab>
              <LogoIcon />
              <Body14>
                <BodyBold>{t('sessions', {ns: 'Component.Tabs'})}</BodyBold>
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
          <ContinueButton
            onPress={onGetStartedPress}
            RightIcon={ArrowRightIcon}>
            <BodyBold>{t('getStartedButton')}</BodyBold>
          </ContinueButton>
        </Screen>
      </Screens>
    </>
  );
};

export default Onboarding;
