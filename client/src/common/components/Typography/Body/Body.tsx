import styled from 'styled-components/native';

import typeStyles from '../styles';

const BaseText = styled.Text.attrs(({selectable}) => ({
  allowFontScaling: false,
  selectable: selectable ?? true,
}))({});

export const Body18 = styled(BaseText)(typeStyles.Body18);
export const Body16 = styled(BaseText)(typeStyles.Body16);
export const Body14 = styled(BaseText)(typeStyles.Body14);
export const BodyBold = styled(BaseText)(typeStyles.BodyBold);
export const TextLink = styled(BaseText)(typeStyles.TEXTLINK);
