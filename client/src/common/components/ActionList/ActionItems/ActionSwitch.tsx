import React from 'react';
import styled from 'styled-components/native';
import {Body16} from '../../Typography/Body/Body';
import ActionIconItem from './ActionIconItem';

const Switch = styled.Switch({
  alignSelf: 'flex-end',
});

const TextWrapper = styled.View({flex: 1});

type ActionSwitchProps = React.ComponentProps<typeof ActionIconItem> &
  React.ComponentProps<typeof Switch>;
const ActionSwitch: React.FC<ActionSwitchProps> = ({
  Icon,
  style,
  children,
  ...switchProps
}) => (
  <ActionIconItem Icon={Icon} style={style}>
    <TextWrapper>
      <Body16>{children}</Body16>
    </TextWrapper>
    <Switch {...switchProps} />
  </ActionIconItem>
);

export default ActionSwitch;
