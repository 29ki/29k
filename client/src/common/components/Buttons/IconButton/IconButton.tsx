import React from 'react';
import {ViewStyle} from 'react-native';
import styled from 'styled-components/native';
import {COLORS} from '../../../constants/colors';
import {SPACINGS} from '../../../constants/spacings';
import {IconType} from '../../Icons';
import TouchableOpacity from '../../TouchableOpacity/TouchableOpacity';

const StyledIconButton = styled(TouchableOpacity)<{
  active: boolean;
  noBackground: boolean;
}>(props => ({
  width: SPACINGS.FOURTYFOUR,
  height: SPACINGS.FOURTYFOUR,
  borderRadius: SPACINGS.SIXTEEN,
  padding: SPACINGS.EIGHT,
  ...(props.noBackground
    ? {}
    : {backgroundColor: props.active ? COLORS.GREY : COLORS.ROSE500}),
}));

type IconButtonProps = {
  onPress?: () => void;
  fill?: string;
  Icon: IconType;
  disabled?: boolean;
  style?: ViewStyle;
  active?: boolean;
  noBackground?: boolean;
};

const IconButton: React.FC<IconButtonProps> = ({
  onPress,
  fill = COLORS.GREY100,
  Icon,
  disabled = false,
  style,
  active = true,
  noBackground = false,
}) => (
  <StyledIconButton
    onPress={onPress}
    disabled={disabled}
    style={style}
    active={active}
    noBackground={noBackground}>
    <Icon fill={fill} />
  </StyledIconButton>
);

export default IconButton;
