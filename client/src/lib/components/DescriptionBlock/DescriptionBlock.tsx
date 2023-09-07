import React from 'react';
import {IconType} from '../Icons';
import styled from 'styled-components/native';
import SETTINGS from '../../constants/settings';
import {COLORS} from '../../../../../shared/src/constants/colors';
import {Spacer8} from '../Spacers/Spacer';
import {SPACINGS} from '../../constants/spacings';

const Wrapper = styled.View<{transparent?: boolean}>(({transparent}) => ({
  overflow: 'hidden',
  backgroundColor: transparent ? 'transparent' : COLORS.PURE_WHITE,
  borderRadius: SETTINGS.BORDER_RADIUS.ACTION_LISTS,
  flexDirection: 'row',
  padding: SPACINGS.SIXTEEN,
}));

const IconWrapper = styled.View({
  width: 30,
  height: 30,
  alignItems: 'center',
  justifyContent: 'center',
  marginLeft: -SPACINGS.EIGHT,
});

const Content = styled.View({
  justifyContent: 'center',
  flexShrink: 1,
});

type DescriptionBlockProps = {
  Icon?: IconType;
  children: React.ReactNode;
  transparent?: boolean;
};
const DescriptionBlock: React.FC<DescriptionBlockProps> = ({
  Icon,
  children,
  transparent,
}) => (
  <Wrapper transparent={transparent}>
    {Icon && (
      <>
        <IconWrapper>
          <Icon />
        </IconWrapper>
        <Spacer8 />
      </>
    )}
    <Content>{children}</Content>
  </Wrapper>
);

export default DescriptionBlock;
