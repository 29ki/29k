import React from 'react';
import styled from 'styled-components/native';

import typeStyles from '../styles';

const BaseHeading = styled.Text.attrs({
  allowFontScaling: false,
  selectable: true,
})({});

const MemoizedBaseHeading = React.memo(BaseHeading);

export const Heading24 = styled(MemoizedBaseHeading)(typeStyles.Heading24);
export const Heading22 = styled(MemoizedBaseHeading)(typeStyles.Heading22);
export const Heading18 = styled(MemoizedBaseHeading)(typeStyles.Heading18);
export const Heading16 = styled(MemoizedBaseHeading)(typeStyles.Heading16);
export const ModalHeading = styled(MemoizedBaseHeading)(
  typeStyles.ModalHeading,
);
