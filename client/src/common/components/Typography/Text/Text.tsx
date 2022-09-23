import styled from 'styled-components/native';

import typeStyles from '../styles';

const BaseText = styled.Text({});
BaseText.defaultProps = {
  allowFontScaling: false,
};

export const B18 = styled(BaseText)(typeStyles.B18);
export const B16 = styled(BaseText)(typeStyles.B16);
export const B14 = styled(BaseText)(typeStyles.B14);
export const TextLink = styled(BaseText)(typeStyles.TEXTLINK);
