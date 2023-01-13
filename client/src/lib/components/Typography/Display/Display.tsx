import styled from 'styled-components/native';

import typeStyles from '../styles';

const BaseDisplay = styled.Text.attrs({
  allowFontScaling: false,
  selectable: true,
})({});

export const Display36 = styled(BaseDisplay)(typeStyles.Display36);
export const Display28 = styled(BaseDisplay)(typeStyles.Display28);
export const Display24 = styled(BaseDisplay)(typeStyles.Display24);
export const Display22 = styled(BaseDisplay)(typeStyles.Display22);
export const Display20 = styled(BaseDisplay)(typeStyles.Display20);
export const Display18 = styled(BaseDisplay)(typeStyles.Display18);
export const Display16 = styled(BaseDisplay)(typeStyles.Display16);
export const Display14 = styled(BaseDisplay)(typeStyles.Display14);
