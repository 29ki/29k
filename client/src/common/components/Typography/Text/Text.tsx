import styled from 'styled-components/native';

import typeStyles from '../styles';

const BaseText = styled.Text({});
BaseText.defaultProps = {
  allowFontScaling: false,
};

export const B1 = styled(BaseText)(typeStyles.B1);
export const B2 = styled(BaseText)(typeStyles.B2);
export const B3 = styled(BaseText)(typeStyles.B3);
export const TextLink = styled(BaseText)(typeStyles.TEXTLINK);
