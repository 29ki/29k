import React, {useCallback, useEffect, useRef, useState} from 'react';
import styled from 'styled-components/native';
import AnimatedLottieView from 'lottie-react-native';
import {SPACINGS} from '../../../constants/spacings';
import BaseButton, {BaseButtonProps} from '../BaseButton';
import {AnimatedIconType} from '../../Icons/AnimatedIcon';

export type BaseIconButtonProps = BaseButtonProps & {
  noBackground?: boolean;
  fill?: string;
};

const StyledIconButton = styled(BaseButton)<BaseIconButtonProps>(props => ({
  ...(props.noBackground ? {backgroundColor: 'transparent'} : {}),
  width: props.small ? 36 : 44,
  height: props.small ? 36 : 44,
  padding: props.small ? 3 : 7,
  borderRadius: SPACINGS.SIXTEEN,
}));

export type IconButtonProps = BaseIconButtonProps & {
  AnimatedIcon: AnimatedIconType;
};

const AnimatedIconButton: React.FC<IconButtonProps> = ({
  onPress,
  variant,
  AnimatedIcon,
  style,
  disabled,
  small,
  elevated,
  active,
  noBackground,
  fill,
}) => {
  const lottieRef = useRef<AnimatedLottieView>(null);
  const [allreadyActive, setAllreadyActive] = useState(active);
  const [pressed, setPressed] = useState(false);

  useEffect(() => {
    if (!pressed && !allreadyActive && active) {
      lottieRef.current?.play();
    }
  }, [allreadyActive, active, pressed]);

  const animatedPress = useCallback(() => {
    if (!active) {
      lottieRef.current?.play();
    } else {
      setAllreadyActive(false);
      lottieRef.current?.reset();
    }
    setPressed(true);
    onPress();
  }, [onPress, active, setAllreadyActive]);

  return (
    <StyledIconButton
      hitSlop={
        small
          ? {
              bottom: SPACINGS.FOUR,
              left: SPACINGS.FOUR,
              right: SPACINGS.FOUR,
              top: SPACINGS.FOUR,
            }
          : {}
      }
      onPress={animatedPress}
      variant={variant}
      disabled={disabled}
      style={style}
      small={small}
      elevated={elevated}
      noBackground={noBackground}>
      <AnimatedIcon
        ref={lottieRef}
        progress={allreadyActive ? 1 : undefined}
        loop={false}
        fill={fill}
        autoPlay={false}
      />
    </StyledIconButton>
  );
};

export default React.memo(AnimatedIconButton);
