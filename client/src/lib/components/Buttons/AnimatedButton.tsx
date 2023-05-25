import React, {useCallback, useRef, useState} from 'react';
import styled from 'styled-components/native';
import {COLORS} from '../../../../../shared/src/constants/colors';
import {SPACINGS} from '../../constants/spacings';
import {Body16} from '../Typography/Body/Body';
import BaseButton, {BaseButtonProps, ButtonVariant} from './BaseButton';
import AnimatedLottieView, {AnimationObject} from 'lottie-react-native';

const AnimationWrapper = styled.View({
  width: 21,
  height: 21,
  alignItems: 'center',
  justifyContent: 'center',
  marginRight: -SPACINGS.TWELVE,
  marginLeft: SPACINGS.EIGHT,
});

const Lottie = styled(AnimatedLottieView)({
  flex: 1,
});

type ButtonTextProps = {
  variant?: ButtonVariant;
  small?: boolean;
  active?: boolean;
  disabled?: boolean;
  children: React.ReactNode;
};

const ButtonText = styled(Body16).attrs({selectable: false})<ButtonTextProps>(
  ({variant, small, active, disabled}) => ({
    height: 20,
    color:
      disabled || active || variant !== 'tertiary'
        ? COLORS.WHITE
        : COLORS.BLACK,
    marginVertical: small ? 8 : SPACINGS.TWELVE,
    marginHorizontal: SPACINGS.SIXTEEN,
  }),
);

type AnimatedButtonProps = Omit<BaseButtonProps, 'variant'> & {
  animation: AnimationObject;
  preVariant: BaseButtonProps['variant'];
  postVariant: BaseButtonProps['variant'];
};

const AnimatedButton: React.FC<AnimatedButtonProps> = ({
  children,
  onPress,
  style,
  disabled,
  small,
  animation,
  elevated,
  active,
  preVariant,
  postVariant,
}) => {
  const lottieRef = useRef<AnimatedLottieView>(null);
  const [allreadyActive, setAllreadyActive] = useState(active);

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
    <BaseButton
      hitSlop={{
        bottom: small ? SPACINGS.EIGHT : undefined,
        left: undefined,
        right: undefined,
        top: small ? SPACINGS.EIGHT : undefined,
      }}
      onPress={animatedPress}
      variant={active ? postVariant : preVariant}
      elevated={elevated}
      small={small}
      style={style}
      disabled={disabled}>
      <AnimationWrapper>
        <Lottie
          ref={lottieRef}
          progress={allreadyActive ? 1 : undefined}
          source={animation}
          loop={false}
        />
      </AnimationWrapper>
      <ButtonText
        small={small}
        variant={active ? postVariant : preVariant}
        active={active}
        disabled={disabled}
        selectable={false}>
        {children}
      </ButtonText>
    </BaseButton>
  );
};

export default React.memo(AnimatedButton);
