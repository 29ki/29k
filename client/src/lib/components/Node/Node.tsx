import React from 'react';
import styled from 'styled-components/native';
import {COLORS} from '../../../../../shared/src/constants/colors';

type NodeProps = {
  size?: number;
};

const Dot = styled.View<NodeProps>(({size = 14}) => ({
  height: size,
  width: size,
  borderRadius: size / 2,
  backgroundColor: COLORS.MEDIUM_DARK_GREEN,
}));

const Node: React.FC<NodeProps> = ({size = 14}) => <Dot size={size} />;

export default Node;
