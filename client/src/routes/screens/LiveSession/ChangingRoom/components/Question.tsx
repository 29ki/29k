import React, {useCallback, useState} from 'react';
import {StyleSheet, View} from 'react-native';
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

const SliderWrapper = styled.View({
  height: 36,
});

const QuestionSlider = styled(Slider).attrs({
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

const Thumb = styled.View<{active: boolean}>(({active}) => ({
  width: 36,
  height: 36,
  opacity: active ? 1 : 0.5,
}));

const Emoji = styled(Animated.Image)({
  ...StyleSheet.absoluteFillObject,
});

const EmojiExcited = styled(Emoji).attrs({
  source: {uri: 'emoji_excited'},
})({});
const EmojiNeutral = styled(Emoji).attrs({
  source: {uri: 'emoji_neutral'},
})({});
const EmojiNervous = styled(Emoji).attrs({
  source: {uri: 'emoji_nervous'},
})({});

type Props = {
  progress: SharedValue<number>;
  active: boolean;
};
const AnimatedThumb = ({progress, active}: Props) => {
  const excitedStyle = useAnimatedStyle(() => ({
    opacity: withTiming(progress.value <= 1.5 ? 1 : 0, {
      duration: 400,
    }),
  }));
  const nervousStyle = useAnimatedStyle(() => ({
    opacity: withTiming(progress.value >= 2.5 ? 1 : 0, {
      duration: 400,
    }),
  }));

  return (
    <Thumb active={active}>
      <EmojiNeutral />
      <EmojiExcited style={excitedStyle} />
      <EmojiNervous style={nervousStyle} />
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

const Question = () => {
  const [value, setValue] = useState(0);
  const stepValue = Math.round(value);
  const active = Boolean(stepValue);

  const min = useSharedValue(1);
  const max = useSharedValue(3);
  const progress = useSharedValue(2);

  const renderThumb = useCallback(
    () => <AnimatedThumb progress={progress} active={active} />,
    [progress, active],
  );

  return (
    <>
      <Body16>
        <BodyBold>How do you feel about joining this live session?</BodyBold>
      </Body16>
      <Spacer16 />
      <SliderWrapper>
        <QuestionSlider
          minimumValue={min}
          maximumValue={max}
          progress={progress}
          renderThumb={renderThumb}
          onSlidingComplete={setValue}
        />
      </SliderWrapper>
      <Spacer8 />
      <Scale>
        <ScaleLabel active={stepValue === 1}>Excited</ScaleLabel>
        <ScaleLabel active={stepValue === 2}>Neutral</ScaleLabel>
        <ScaleLabel active={stepValue === 3}>Nervous</ScaleLabel>
      </Scale>
      <Spacer16 />
      {stepValue === 1 && (
        <Body16>
          Nice! Thanks for being here. Your presence makes the session great.
        </Body16>
      )}
      {stepValue === 2 && (
        <Body16>
          Thanks for showing up. If you feel a bit uncertain, you’re in the
          right place. We’ll guide you through the experience, so you can listen
          in or participate in any way you like.{' '}
        </Body16>
      )}
      {stepValue === 3 && (
        <Body16>
          Thanks for sharing. In this place, all of you is welcome. We’re here
          to support. And it’s okay to just listen in with the camera off – we
          appreciate your presence in any form.
        </Body16>
      )}
    </>
  );
};

export default Question;
