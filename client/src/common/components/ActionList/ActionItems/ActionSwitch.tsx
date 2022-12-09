import React from 'react';
import styled from 'styled-components/native';
import {COLORS} from '../../../../../../shared/src/constants/colors';
import ActionItemText from '../ActionItemText';
import ActionIconItem from './ActionIconItem';

const Switch = styled.Switch.attrs({
  trackColor: {true: COLORS.PRIMARY},
})({
  alignSelf: 'flex-end',
});

type ActionSwitchProps = React.ComponentProps<typeof ActionIconItem> &
  React.ComponentProps<typeof Switch>;
const ActionSwitch: React.FC<ActionSwitchProps> = ({
  Icon,
  style,
  children,
  ...switchProps
}) => (
  <ActionIconItem Icon={Icon} style={style}>
    <ActionItemText>{children}</ActionItemText>
    <Switch {...switchProps} />
  </ActionIconItem>
);

export default ActionSwitch;
