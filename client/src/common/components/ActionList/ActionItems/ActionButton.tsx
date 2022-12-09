import React from 'react';
import {TouchableOpacityProps} from 'react-native';
import TouchableOpacity from '../../TouchableOpacity/TouchableOpacity';
import {Body16} from '../../Typography/Body/Body';
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
      <Body16>{children}</Body16>
    </ActionIconItem>
  </TouchableOpacity>
);

export default ActionButton;
