import React from 'react';
import {TouchableOpacityProps, ViewStyle} from 'react-native';
import styled from 'styled-components/native';
import {COLORS} from '../../../../../../shared/src/constants/colors';
import {SPACINGS} from '../../../constants/spacings';
import {CloseIcon} from '../../Icons/Close/Close';
import TouchableOpacity from '../../TouchableOpacity/TouchableOpacity';

const Button = styled(TouchableOpacity)({
  width: SPACINGS.TWENTYEIGHT,
  height: SPACINGS.TWENTYEIGHT,
  borderRadius: 24,
  backgroundColor: COLORS.BLACK,
});

type CloseButtonProps = {
  onPress: TouchableOpacityProps['onPress'];
  style?: ViewStyle;
};
const CloseButton: React.FC<CloseButtonProps> = ({onPress, style}) => (
  <Button
    onPress={onPress}
    style={style}
    hitSlop={{
      bottom: SPACINGS.SIXTEEN,
      left: SPACINGS.SIXTEEN,
      right: SPACINGS.SIXTEEN,
      top: SPACINGS.SIXTEEN,
    }}>
    <CloseIcon fill={COLORS.WHITE} />
  </Button>
);

export default CloseButton;
