import {ViewStyle} from 'react-native';
import AnimatedLottieView from 'lottie-react-native';
import {ExerciseCard} from '../../../../../shared/src/types/generated/Exercise';
import React, {useMemo} from 'react';
import styled from 'styled-components/native';
import Image from '../Image/Image';
import {CollectionCard} from '../../../../../shared/src/types/generated/Collection';

const Graphic = styled.View<{backgroundColor?: string}>(
  ({backgroundColor}) => ({
    aspectRatio: '1',
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor,
  }),
);

const Lottie = styled(AnimatedLottieView)({
  width: '100%',
  height: '100%',
});

type Props = {
  graphic?: ExerciseCard | CollectionCard;
  style?: ViewStyle;
};

const CardGraphic: React.FC<Props> = ({graphic, style}) => {
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
    <Graphic style={style} backgroundColor={graphic?.imageBackgroundColor}>
      {lottie ? (
        <Lottie source={lottie} autoPlay loop resizeMode="cover" />
      ) : image ? (
        <Image source={image} resizeMode="cover" />
      ) : null}
    </Graphic>
  );
};

export default CardGraphic;
