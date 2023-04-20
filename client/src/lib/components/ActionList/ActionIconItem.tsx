import React from 'react';
import {ViewStyle} from 'react-native';
import styled from 'styled-components/native';
import {SPACINGS} from '../../constants/spacings';
import {IconType} from '../Icons';
import {Spacer4} from '../Spacers/Spacer';
import ActionItem from './ActionItem';

const ActionWrapper = styled(ActionItem)({
  paddingHorizontal: SPACINGS.EIGHT,
});

const IconWrapper = styled.View({
  width: 30,
  height: 30,
  alignItems: 'center',
  justifyContent: 'center',
});

type ActionIconItemProps = {
  Icon?: IconType;
  style?: ViewStyle;
  children: React.ReactNode;
};
const ActionIconItem: React.FC<ActionIconItemProps> = ({
  Icon,
  style,
  children,
}) => (
  <ActionWrapper style={style}>
    {Icon && (
      <>
        <IconWrapper>
          <Icon />
        </IconWrapper>
      </>
    )}
    <Spacer4 />
    {children}
  </ActionWrapper>
);

export default ActionIconItem;
