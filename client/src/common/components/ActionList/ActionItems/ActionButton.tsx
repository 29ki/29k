import React from 'react';
import {TouchableOpacityProps} from 'react-native';
import TouchableOpacity from '../../TouchableOpacity/TouchableOpacity';
import ActionItemText from '../ActionItemText';
import ActionIconItem from './ActionIconItem';

type ActionLinkProps = React.ComponentProps<typeof ActionIconItem> & {
  onPress?: TouchableOpacityProps['onPress'];
};
const ActionButton: React.FC<ActionLinkProps> = ({
  onPress,
  Icon,
  style,
  children,
}) => (
  <TouchableOpacity onPress={onPress}>
    <ActionIconItem Icon={Icon} style={style}>
      <ActionItemText numberOfLines={1}>{children}</ActionItemText>
    </ActionIconItem>
  </TouchableOpacity>
);

export default ActionButton;
