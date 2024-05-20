import React from 'react';
import styled from 'styled-components/native';
import Tag from './Tag';
import {COLORS} from '../../../../../shared/src/constants/colors';

const Wrapper = styled.View({
  alignSelf: 'flex-start',
});

const Tip = styled.View({
  position: 'absolute',
  left: 4,
  bottom: -5,
  width: 0,
  height: 0,
  backgroundColor: 'transparent',
  borderStyle: 'solid',
  borderRightWidth: 5,
  borderTopWidth: 5,
  borderRightColor: 'transparent',
  borderTopColor: COLORS.BLACK,
});

const Background = styled(Tag)<{small?: boolean}>(({small}) => ({
  paddingVertical: small ? 0 : 1,
  backgroundColor: COLORS.BLACK,
  color: COLORS.WHITE,
}));

type LanguageTagProps = {
  small?: boolean;
  children: React.ReactNode;
};
const LanguageTag: React.FC<LanguageTagProps> = ({children, small}) => (
  <Wrapper>
    <Background small={small}>{children}</Background>
    <Tip />
  </Wrapper>
);

export default LanguageTag;
