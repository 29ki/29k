import React, {forwardRef, useMemo} from 'react';
import {Path} from 'react-native-svg';
import AnimatedLottieView from 'lottie-react-native';
import {IconType} from '..';
import {COLORS} from '../../../../../../shared/src/constants/colors';
import Icon from '../Icon';
import AnimatedIcon, {AnimatedIconProps} from '../AnimatedIcon';
import animation from './bell-lottie.json';

export const BellIcon: IconType = ({fill = COLORS.BLACK}) => (
  <Icon>
    <Path
      d="M7.925 20.578h3.62c.062 1.67 1.434 3.217 3.455 3.217 2.013 0 3.393-1.53 3.463-3.217h3.612c.914 0 1.477-.5 1.477-1.257 0-.94-.853-1.74-1.653-2.505-.624-.606-.773-1.819-.887-3.058-.123-3.314-1.099-5.529-3.384-6.355C17.285 6.234 16.31 5.347 15 5.347s-2.285.887-2.62 2.056c-2.293.826-3.26 3.041-3.392 6.355-.114 1.24-.263 2.452-.887 3.058-.8.765-1.653 1.565-1.653 2.505 0 .756.563 1.257 1.477 1.257Zm.668-1.635v-.105c.228-.255.738-.72 1.169-1.213.606-.694.887-1.977.975-3.648.106-3.524 1.196-4.71 2.602-5.088.22-.062.334-.167.351-.405C13.734 7.597 14.235 7 15 7c.773 0 1.266.598 1.31 1.485.017.238.14.343.351.405 1.415.378 2.496 1.564 2.602 5.088.096 1.67.378 2.954.975 3.648.43.492.923.958 1.152 1.213v.105H8.593ZM15 22.38c-.993 0-1.705-.712-1.767-1.802h3.542c-.052 1.081-.773 1.802-1.775 1.802Z"
      fill={fill}
    />
  </Icon>
);

type BellAnimatedProps = Omit<AnimatedIconProps, 'source'>;

export const BellIconAnimated: React.FC<BellAnimatedProps> = forwardRef<
  AnimatedLottieView,
  BellAnimatedProps
>(({fill = COLORS.BLACK, loop = true, autoPlay = true, ...props}, ref) => {
  const colorFilters = useMemo(
    () => [
      {keypath: 'Layer 1', color: fill},
      {keypath: 'Layer 2', color: fill},
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
});
