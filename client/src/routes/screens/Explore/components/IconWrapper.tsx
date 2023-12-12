import React from 'react';
import {IconType} from '../../../../lib/components/Icons';
import styled from 'styled-components/native';

const Wrapper = styled.View({
  flexDirection: 'row',
  alignItems: 'center',
});

const iconStyle = {
  width: 21,
  height: 21,
};

type Props = {
  Icon: IconType;
  children: React.ReactNode;
};
const IconWrapper: React.FC<Props> = ({Icon, children}) => (
  <Wrapper>
    <Icon style={iconStyle} />
    {children}
  </Wrapper>
);
export default IconWrapper;
