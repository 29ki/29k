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

export type IconButtonProps = Omit<BaseIconButtonProps, 'variant'> & {
  AnimatedIcon: AnimatedIconType;
  preVariant: BaseButtonProps['variant'];
  postVariant: BaseButtonProps['variant'];
};

const AnimatedIconButton: React.FC<IconButtonProps> = ({
  onPress,
  preVariant,
  postVariant,
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

  useEffect(() => {
    if (!allreadyActive && active) {
      lottieRef.current?.play();
    }
  }, [allreadyActive, active]);

  const animatedPress = useCallback(() => {
    if (!active) {
      lottieRef.current?.play();
    } else {
      setAllreadyActive(false);
      lottieRef.current?.reset();
    }
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
      variant={active ? postVariant : preVariant}
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
      />
    </StyledIconButton>
  );
};

export default React.memo(AnimatedIconButton);
