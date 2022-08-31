import React from 'react';
import {TouchableOpacity, ViewStyle} from 'react-native';
import styled from 'styled-components/native';
import {COLORS} from '../../../constants/colors';
import {SPACINGS} from '../../../constants/spacings';
import {IconType} from '../../Icons';

const StyledIconButton = styled(TouchableOpacity)<{active: boolean}>(props => ({
  width: SPACINGS.FOURTYFOUR,
  height: SPACINGS.FOURTYFOUR,
  margin: 'auto',
  borderRadius: SPACINGS.SIXTEEN,
  backgroundColor: props.active ? COLORS.GREY : COLORS.ROSE500,
  padding: SPACINGS.EIGHT,
}));

type IconButtonProps = {
  onPress?: () => void;
  fill?: string;
  Icon: IconType;
  disabled?: boolean;
  style?: ViewStyle;
  active?: boolean;
};

const IconButton: React.FC<IconButtonProps> = ({
  onPress,
  fill = COLORS.GREY100,
  Icon,
  disabled = false,
  style,
  active = true,
}) => (
  <StyledIconButton
    onPress={onPress}
    disabled={disabled}
    style={style}
    active={active}>
    <Icon fill={fill} />
  </StyledIconButton>
);

export default IconButton;
