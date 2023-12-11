import React from 'react';
import styled from 'styled-components/native';
import {COLORS} from '../../../../../../shared/src/constants/colors';
import TouchableOpacity from '../../../../lib/components/TouchableOpacity/TouchableOpacity';
import {Body16} from '../../../../lib/components/Typography/Body/Body';
import {Tag as TagType} from '../../../../../../shared/src/types/generated/Tag';

const Container = styled(TouchableOpacity)<{active?: boolean}>(({active}) => ({
  padding: 8,
  backgroundColor: active ? COLORS.BLACK : COLORS.CREAM,
  borderRadius: 8,
  overflow: 'hidden',
}));

const Name = styled(Body16)<{active?: boolean}>(({active}) => ({
  textAlign: 'center',
  color: active ? COLORS.PURE_WHITE : COLORS.BLACK,
}));

type Props = {
  tag: TagType;
  active?: boolean;
  onPress?: () => void;
};
const Tag: React.FC<Props> = ({tag, active, onPress}) => {
  return (
    <Container active={active} onPress={onPress}>
      <Name active={active}>{tag.name}</Name>
    </Container>
  );
};

export default Tag;
