import React from 'react';
import styled from 'styled-components/native';

import {COLORS} from '../../../../../../shared/src/constants/colors';
import {SPACINGS} from '../../../constants/spacings';
import SETTINGS from '../../../constants/settings';
import TouchableOpacity from '../../TouchableOpacity/TouchableOpacity';

export const WALLET_CARD_HEIGHT = 80;

const Wrapper = styled(TouchableOpacity)<{
  hasCardBefore: boolean;
  hasCardAfter: boolean;
  completed?: boolean;
}>(({hasCardBefore, hasCardAfter, completed}) => ({
  justifyContent: 'space-between',
  borderRadius: SETTINGS.BORDER_RADIUS.CARDS,
  backgroundColor: completed ? COLORS.LIGHT_GREEN : COLORS.CREAM,
  marginTop: hasCardBefore ? -(WALLET_CARD_HEIGHT * 0.5) : undefined,
  height: hasCardAfter ? WALLET_CARD_HEIGHT * 1.5 : WALLET_CARD_HEIGHT,
  shadowColor: COLORS.BLACK,
  shadowOffset: `0 -${SPACINGS.EIGHT}px`,
  shadowRadius: 20,
  shadowOpacity: 0.1,
  elevation: 5,
}));

export type WalletCardBaseProps = {
  onPress: () => void;
  children?: React.ReactNode;
  hasCardBefore: boolean;
  hasCardAfter: boolean;
  completed?: boolean;
};

export const WalletCardBase: React.FC<WalletCardBaseProps> = ({
  onPress,
  hasCardBefore,
  hasCardAfter,
  completed,
  children,
}) => (
  <Wrapper
    hasCardBefore={hasCardBefore}
    hasCardAfter={hasCardAfter}
    completed={completed}
    onPress={onPress}>
    {children}
  </Wrapper>
);

export default WalletCardBase;
