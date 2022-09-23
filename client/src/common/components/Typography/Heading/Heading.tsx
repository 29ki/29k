import styled from 'styled-components/native';

import typeStyles from '../styles';

const BaseHeading = styled.Text({});
BaseHeading.defaultProps = {
  allowFontScaling: false,
};

export const H24 = styled(BaseHeading)(typeStyles.H24);
export const H22 = styled(BaseHeading)(typeStyles.H22);
export const H18 = styled(BaseHeading)(typeStyles.H18);
export const H16 = styled(BaseHeading)(typeStyles.H16);
