import React from 'react';
import styled from 'styled-components/native';
import {COLORS} from '../../../../../shared/src/constants/colors';

type NodeProps = {
  size?: number;
};

const Ring = styled.View<NodeProps>(({size = 22}) => ({
  height: size,
  width: size,
  border: 1,
  borderRadius: size / 2,
  backgroundColor: COLORS.WHITE,
  alignItems: 'center',
  justifyContent: 'center',
}));

const Dot = styled.View<NodeProps>(({size = 14}) => ({
  height: size,
  width: size,
  borderRadius: size / 2,
  backgroundColor: COLORS.MEDIUM_GREEN,
}));

const Node: React.FC<NodeProps> = ({size = 22}) => (
  <Ring size={size}>
    <Dot size={size * 0.636} />
  </Ring>
);

export default Node;
