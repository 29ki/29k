import React from 'react';
import styled from 'styled-components/native';

import typeStyles from '../styles';

const BaseDisplay = styled.Text.attrs({
  allowFontScaling: false,
  selectable: true,
})({});

const MemoizedBaseDisplay = React.memo(BaseDisplay);

export const Display36 = styled(MemoizedBaseDisplay)(typeStyles.Display36);
export const Display28 = styled(MemoizedBaseDisplay)(typeStyles.Display28);
export const Display24 = styled(MemoizedBaseDisplay)(typeStyles.Display24);
export const Display22 = styled(MemoizedBaseDisplay)(typeStyles.Display22);
export const Display20 = styled(MemoizedBaseDisplay)(typeStyles.Display20);
export const Display18 = styled(MemoizedBaseDisplay)(typeStyles.Display18);
export const Display16 = styled(MemoizedBaseDisplay)(typeStyles.Display16);
export const Display14 = styled(MemoizedBaseDisplay)(typeStyles.Display14);
