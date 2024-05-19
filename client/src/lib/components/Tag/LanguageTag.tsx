import React from 'react';
import styled from 'styled-components/native';
import Tag from './Tag';
import {COLORS} from '../../../../../shared/src/constants/colors';

const Tip = styled.View({
  position: 'absolute',
  left: 4,
  top: '100%',
  width: 0,
  height: 0,
  backgroundColor: 'transparent',
  borderStyle: 'solid',
  borderRightWidth: 5,
  borderTopWidth: 5,
  borderRightColor: 'transparent',
  borderTopColor: COLORS.BLACK,
});

const Background = styled(Tag)({
  backgroundColor: COLORS.BLACK,
  color: COLORS.WHITE,
});

type LanguageTagProps = {
  children: React.ReactNode;
};
const LanguageTag: React.FC<LanguageTagProps> = ({children}) => (
  <>
    <Background>{children}</Background>
    <Tip />
  </>
);

export default LanguageTag;
