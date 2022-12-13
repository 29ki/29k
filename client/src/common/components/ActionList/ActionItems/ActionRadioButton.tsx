import React from 'react';
import styled from 'styled-components/native';
import {COLORS} from '../../../../../../shared/src/constants/colors';
import ActionItemText from '../ActionItemText';
import ActionIconItem from '../ActionIconItem';
import {CheckedIcon} from '../../Icons';
import {Spacer4} from '../../Spacers/Spacer';
import TouchableOpacity from '../../TouchableOpacity/TouchableOpacity';
import {TouchableOpacityProps} from 'react-native';

const IconWrapper = styled.View({
  width: 30,
  height: 30,
});

type ActionRadioButtonProps = React.ComponentProps<typeof ActionIconItem> & {
  checked?: boolean;
  onPress?: TouchableOpacityProps['onPress'];
};
const ActionRadioButton: React.FC<ActionRadioButtonProps> = ({
  Icon,
  onPress,
  style,
  children,
  checked,
}) => (
  <TouchableOpacity onPress={onPress}>
    <ActionIconItem Icon={Icon} style={style}>
      <ActionItemText>{children}</ActionItemText>
      {checked && (
        <>
          <Spacer4 />
          <IconWrapper>
            <CheckedIcon fill={COLORS.PRIMARY} />
          </IconWrapper>
        </>
      )}
    </ActionIconItem>
  </TouchableOpacity>
);

export default ActionRadioButton;
