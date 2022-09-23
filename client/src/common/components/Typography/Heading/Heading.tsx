import styled from 'styled-components/native';

import typeStyles from '../styles';

const BaseHeading = styled.Text.attrs({allowFontScaling: false})({});

export const Heading24 = styled(BaseHeading)(typeStyles.Heading24);
export const Heading22 = styled(BaseHeading)(typeStyles.Heading22);
export const Heading18 = styled(BaseHeading)(typeStyles.Heading18);
export const Heading16 = styled(BaseHeading)(typeStyles.Heading16);
