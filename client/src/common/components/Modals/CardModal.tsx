import React from 'react';

import styled from 'styled-components/native';

import {COLORS} from '../../../../../shared/src/constants/colors';
import SETTINGS from '../../constants/settings';

const Container = styled.View<{backgroundColor?: string}>(
  ({backgroundColor}) => ({
    flex: 1,
    paddingTop: 24, // Equals the height of the modal handle
    backgroundColor,
    borderRadius: SETTINGS.BORDER_RADIUS.MODALS,
  }),
);

type ModalProps = {
  backgroundColor?: string;
  children: React.ReactNode;
};

export const CardModal: React.FC<ModalProps> = ({
  children,
  backgroundColor = COLORS.WHITE,
}) => <Container backgroundColor={backgroundColor}>{children}</Container>;

export default CardModal;
