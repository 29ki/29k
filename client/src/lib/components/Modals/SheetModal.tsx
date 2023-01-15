import React from 'react';
import {TouchableOpacityProps} from 'react-native';

import styled from 'styled-components/native';

import {COLORS} from '../../../../../shared/src/constants/colors';
import SETTINGS from '../../constants/settings';
import CloseButton from '../Buttons/CloseButton/CloseButton';
import {TopSafeArea} from '../Spacers/Spacer';

const Container = styled.View<{backgroundColor?: string}>(
  ({backgroundColor}) => ({
    flex: 1,
    paddingTop: 24, // Equals the height of the modal handle
    backgroundColor,
    borderTopLeftRadius: SETTINGS.BORDER_RADIUS.MODALS,
    borderTopRightRadius: SETTINGS.BORDER_RADIUS.MODALS,
    overflow: 'hidden',
  }),
);

const Close = styled(CloseButton)({
  position: 'absolute',
  top: 24,
  right: 24,
});

type ModalProps = {
  onPressClose?: TouchableOpacityProps['onPress'];
  backgroundColor?: string;
  children: React.ReactNode;
};

export const SheetModal: React.FC<ModalProps> = ({
  onPressClose,
  children,
  backgroundColor = COLORS.WHITE,
}) => (
  <Container backgroundColor={backgroundColor}>
    {children}
    {/* This is to compensate for the marginTop in ModalStack */}
    <TopSafeArea />
    {onPressClose && <Close onPress={onPressClose} />}
  </Container>
);

export default SheetModal;
