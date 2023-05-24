import React from 'react';
import {ViewStyle} from 'react-native';
import styled from 'styled-components/native';

import {COLORS} from '../../../../../shared/src/constants/colors';
import {SPACINGS} from '../../constants/spacings';
import {Body12} from '../Typography/Body/Body';
import {IconType} from '../Icons';

const Container = styled.View({
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
  paddingHorizontal: SPACINGS.FOUR,
  paddingVertical: 2,
  borderRadius: SPACINGS.FOUR,
  backgroundColor: COLORS.PURE_WHITE,
  marginTop: SPACINGS.FOUR,
});

const StyledBody = styled(Body12)({
  fontWeight: '500',
});

const IconWrapper = styled.View({
  width: 16,
  height: 16,
});

type TagProps = {
  children: React.ReactNode;
  style?: ViewStyle;
  LeftIcon?: IconType;
  iconFill?: string;
};

const Tag: React.FC<TagProps> = ({children, style, LeftIcon, iconFill}) => (
  <Container style={style}>
    {LeftIcon && (
      <IconWrapper>
        <LeftIcon fill={iconFill} />
      </IconWrapper>
    )}
    <StyledBody style={style}>{children}</StyledBody>
  </Container>
);

export default Tag;
