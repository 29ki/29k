import React from 'react';
import Animated, {
  RotateInUpLeft,
  RotateInUpRight,
  RotateOutDownLeft,
  RotateOutDownRight,
} from 'react-native-reanimated';
import styled from 'styled-components/native';

import {COLORS} from '../../../../../../shared/src/constants/colors';
import {SPACINGS} from '../../../constants/spacings';

import BaseButton, {
  BaseButtonProps,
} from '../../../components/Buttons/BaseButton';
import {Body16} from '../../../components/Typography/Body/Body';
import {MinusIcon, PlusIcon} from '../../../components/Icons';

const IconWrapper = styled.View({
  width: 21,
  height: 21,
  alignItems: 'center',
  justifyContent: 'center',
  marginLeft: -SPACINGS.TWELVE,
  marginRight: SPACINGS.EIGHT,
});

const AnimatedPlusIcon: React.FC<{disabled?: boolean}> = ({disabled}) => {
  return (
    <Animated.View
      entering={RotateInUpRight.duration(300)}
      exiting={RotateOutDownRight.duration(300)}>
      <PlusIcon fill={disabled ? COLORS.GREYMEDIUM : COLORS.BLACK} />
    </Animated.View>
  );
};

const AnimatedMinusIcon = () => {
  return (
    <Animated.View
      entering={RotateInUpLeft.duration(300)}
      exiting={RotateOutDownLeft.duration(300)}>
      <MinusIcon />
    </Animated.View>
  );
};

const Button = styled(BaseButton)({
  height: 25,
  backgroundColor: COLORS.WHITE,
});

const ButtonText = styled(Body16)<{disabled?: boolean}>(({disabled}) => ({
  height: SPACINGS.TWENTY,
  color: disabled ? COLORS.GREYMEDIUM : COLORS.BLACK,
  marginVertical: 8,
  marginHorizontal: SPACINGS.SIXTEEN,
}));

type ToggleButtonProps = BaseButtonProps & {
  isToggled?: boolean;
  title: string;
};

const ToggleButton: React.FC<ToggleButtonProps> = ({
  onPress,
  disabled,
  isToggled,
  title,
}) => {
  return (
    <Button
      small
      variant="tertiary"
      disabled={disabled}
      onPress={onPress}
      hitSlop={{
        top: 10,
        right: 10,
        bottom: 10,
        left: 20,
      }}>
      <>
        <ButtonText disabled={disabled}>{title}</ButtonText>
        {isToggled ? (
          <IconWrapper>
            <AnimatedMinusIcon />
          </IconWrapper>
        ) : (
          <IconWrapper>
            <AnimatedPlusIcon disabled={disabled} />
          </IconWrapper>
        )}
      </>
    </Button>
  );
};

export default ToggleButton;
