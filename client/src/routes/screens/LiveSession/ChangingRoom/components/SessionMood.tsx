import React, {useCallback} from 'react';
import {StyleSheet} from 'react-native';
import {Slider} from 'react-native-awesome-slider';
import Animated, {
  SharedValue,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import styled from 'styled-components/native';
import {COLORS} from '../../../../../../../shared/src/constants/colors';
import {
  Body14,
  Body16,
  BodyBold,
} from '../../../../../lib/components/Typography/Body/Body';
import {Spacer16, Spacer8} from '../../../../../lib/components/Spacers/Spacer';
import textStyles from '../../../../../lib/components/Typography/styles';
import useSessionState from '../../../../../lib/session/state/state';
import {useTranslation} from 'react-i18next';

const SliderWrapper = styled.View({
  height: 36,
});

const MoodSlider = styled(Slider).attrs({
  sliderHeight: 36,
  thumbWidth: 36,
  containerStyle: {
    borderRadius: 18,
    borderWidth: 0,
  },
  renderBubble: () => null,
  panHitSlop: {top: 5, right: 5, bottom: 5, left: 5},
  theme: {
    disableMinTrackTintColor: COLORS.PURE_WHITE,
    maximumTrackTintColor: COLORS.PURE_WHITE,
    minimumTrackTintColor: COLORS.PURE_WHITE,
    cacheTrackTintColor: COLORS.PURE_WHITE,
    bubbleBackgroundColor: COLORS.PURE_WHITE,
  },
})({});

const Thumb = styled.View({
  width: 36,
  height: 36,
});

const Emoji = styled(Animated.Image)({
  ...StyleSheet.absoluteFillObject,
});

const EmojiGrinning = styled(Emoji).attrs({
  source: {uri: 'emoji_grinning'},
})({});
const EmojiSmiling = styled(Emoji).attrs({
  source: {uri: 'emoji_smiling'},
})({});
const EmojiAnxious = styled(Emoji).attrs({
  source: {uri: 'emoji_anxious'},
})({});

type Props = {
  progress: SharedValue<number>;
  active: boolean;
};
const AnimatedThumb = ({progress}: Props) => {
  const smilingStyle = useAnimatedStyle(() => ({
    opacity: withTiming(
      progress.value >= 1.5 && progress.value <= 2.5 ? 1 : 0,
      {
        duration: 400,
      },
    ),
  }));
  const grinningStyle = useAnimatedStyle(() => ({
    opacity: withTiming(progress.value <= 1.5 ? 1 : 0, {
      duration: 400,
    }),
  }));
  const anxiousStyle = useAnimatedStyle(() => ({
    opacity: withTiming(progress.value >= 2.5 ? 1 : 0, {
      duration: 400,
    }),
  }));

  return (
    <Thumb>
      <EmojiSmiling style={smilingStyle} />
      <EmojiGrinning style={grinningStyle} />
      <EmojiAnxious style={anxiousStyle} />
    </Thumb>
  );
};

const Scale = styled.View({
  flexDirection: 'row',
  justifyContent: 'space-between',
});

const ScaleLabel = styled(Body14)<{active?: boolean}>(
  ({active}) => active && textStyles.BodyBold,
);

const SessionMood = () => {
  const {t} = useTranslation('Component.SharingSessionMood');
  const value = useSessionState(state => state.mood);
  const setValue = useSessionState(state => state.setMood);
  const stepValue = Math.round(value ?? 0);
  const active = Boolean(value);

  const min = useSharedValue(1);
  const max = useSharedValue(3);
  const progress = useSharedValue(2);

  const renderThumb = useCallback(
    () => <AnimatedThumb progress={progress} />,
    [progress],
  );

  return (
    <>
      <Body16>
        <BodyBold>{t('question')}</BodyBold>
      </Body16>
      <Spacer16 />
      <SliderWrapper>
        <MoodSlider
          minimumValue={min}
          maximumValue={max}
          progress={progress}
          renderThumb={renderThumb}
          onSlidingComplete={setValue}
        />
      </SliderWrapper>
      <Spacer8 />
      <Scale>
        <ScaleLabel active={stepValue === 1}>
          {t('step', {context: 1})}
        </ScaleLabel>
        <ScaleLabel active={stepValue === 2}>
          {t('step', {context: 2})}
        </ScaleLabel>
        <ScaleLabel active={stepValue === 3}>
          {t('step', {context: 3})}
        </ScaleLabel>
      </Scale>
      {Boolean(stepValue) && (
        <>
          <Spacer16 />
          <Body16>{t('answer', {context: stepValue})}</Body16>
        </>
      )}
    </>
  );
};

export default SessionMood;
