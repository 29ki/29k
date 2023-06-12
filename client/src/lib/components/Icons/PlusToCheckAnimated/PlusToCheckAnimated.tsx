import React, {forwardRef, useMemo} from 'react';
import AnimatedLottieView from 'lottie-react-native';
import AnimatedIcon, {AnimatedIconProps} from '../AnimatedIcon';
import {COLORS} from '../../../../../../shared/src/constants/colors';
import animation from './plus-to-check-lottie.json';

type PlusToCheckIconAnimatedProps = Omit<AnimatedIconProps, 'source'>;

export const PlusToCheckIconAnimated: React.FC<PlusToCheckIconAnimatedProps> =
  forwardRef<AnimatedLottieView, PlusToCheckIconAnimatedProps>(
    ({fill = COLORS.BLACK, loop = true, autoPlay = true, ...props}, ref) => {
      const colorFilters = useMemo(
        () => [
          {keypath: 'Layer 1', color: fill},
          {keypath: 'Layer 2', color: fill},
          {keypath: 'Layer 3', color: fill},
          {keypath: 'Layer 4', color: fill},
        ],
        [fill],
      );
      return (
        <AnimatedIcon
          colorFilters={colorFilters}
          ref={ref}
          source={animation}
          loop={loop}
          autoPlay={autoPlay}
          {...props}
        />
      );
    },
  );
