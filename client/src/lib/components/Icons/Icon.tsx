import React from 'react';
import Svg, {SvgProps} from 'react-native-svg';
import styled from 'styled-components/native';

const SvgIcon = styled(Svg)({
  width: '100%',
  height: '100%',
  aspectRatio: '1',
});

const Icon: React.FC<SvgProps> = ({children, style}) => (
  <SvgIcon style={style} viewBox="0 0 30 30" fill="transparent">
    {children}
  </SvgIcon>
);

export default Icon;
