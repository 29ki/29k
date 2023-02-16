import React from 'react';
import styled from 'styled-components/native';

import typeStyles from '../styles';

const BaseText = styled.Text.attrs(props => ({
  allowFontScaling: false,
  selectable: props?.selectable ?? true,
}))({});

const MemoizedBaseText = React.memo(BaseText);

export const Body18 = styled(MemoizedBaseText)(typeStyles.Body18);
export const Body16 = styled(MemoizedBaseText)(typeStyles.Body16);
export const Body14 = styled(MemoizedBaseText)(typeStyles.Body14);
export const Body12 = styled(MemoizedBaseText)(typeStyles.Body12);
export const BodyBold = styled(MemoizedBaseText)(typeStyles.BodyBold);
export const BodyItalic = styled(MemoizedBaseText)(typeStyles.BodyItalic);
export const TextLink = styled(MemoizedBaseText)(typeStyles.TEXTLINK);
