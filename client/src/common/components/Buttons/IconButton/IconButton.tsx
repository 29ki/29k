import React, {ReactElement} from 'react';
import {TouchableOpacity, ViewStyle} from 'react-native';
import styled from 'styled-components/native';
import {SPACINGS} from '../../../constants/spacings';

const StyledIconButton = styled(TouchableOpacity)({
  padding: 6,
  width: SPACINGS.FOURTYFOUR,
  height: SPACINGS.FOURTYFOUR,
  alignItems: 'center',
  justifyContent: 'center',
});

type IconButtonProps = {
  onPress?: () => void;
  fill?: string;
  Icon: ({fill}: {fill?: string}) => ReactElement;
  disabled?: boolean;
  style?: ViewStyle;
};

const IconButton: React.FC<IconButtonProps> = ({
  onPress,
  fill,
  Icon,
  disabled = false,
  style,
}) => (
  <StyledIconButton onPress={onPress} disabled={disabled} style={style}>
    <Icon fill={fill} />
  </StyledIconButton>
);

export default IconButton;
