import {ViewStyle} from 'react-native';
import AnimatedLottieView from 'lottie-react-native';
import {ExerciseCard} from '../../../../../shared/src/types/generated/Exercise';
import React, {useMemo} from 'react';
import styled from 'styled-components/native';
import Image from '../Image/Image';

const Graphic = styled.View<{backgroundColor?: string}>(
  ({backgroundColor}) => ({
    aspectRatio: 1,
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor,
  }),
);

const Lottie = styled(AnimatedLottieView)({
  aspectRatio: '1',
});

type Props = {
  graphic?: ExerciseCard;
  style?: ViewStyle;
};

const ExerciseGraphic: React.FC<Props> = ({graphic, style}) => {
  const image = useMemo(
    () =>
      graphic?.image?.source
        ? {
            uri: graphic?.image?.source,
          }
        : undefined,
    [graphic?.image?.source],
  );

  const lottie = useMemo(
    () =>
      graphic?.lottie?.source
        ? {
            uri: graphic?.lottie?.source,
          }
        : undefined,
    [graphic?.lottie?.source],
  );

  return (
    <Graphic style={style} backgroundColor={graphic?.backgroundColor}>
      {lottie ? (
        <Lottie source={lottie} autoPlay loop />
      ) : image ? (
        <Image resizeMode="contain" source={image} />
      ) : null}
    </Graphic>
  );
};

export default ExerciseGraphic;
