import styled from 'styled-components/native';

import typeStyles from '../styles';

const BaseHeading = styled.Text({});
BaseHeading.defaultProps = {
  allowFontScaling: false,
};

export const H1 = styled(BaseHeading)(typeStyles.H1);
export const H2 = styled(BaseHeading)(typeStyles.H2);
export const H3 = styled(BaseHeading)(typeStyles.H3);
export const H4 = styled(BaseHeading)(typeStyles.H4);
export const H5 = styled(BaseHeading)(typeStyles.H5);
