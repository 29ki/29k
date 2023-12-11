import React from 'react';
import styled from 'styled-components/native';
import {COLORS} from '../../../../../../shared/src/constants/colors';
import TouchableOpacity from '../../../../lib/components/TouchableOpacity/TouchableOpacity';
import {Body16} from '../../../../lib/components/Typography/Body/Body';
import {Tag as TagType} from '../../../../../../shared/src/types/generated/Tag';

const Container = styled(TouchableOpacity)({
  padding: 8,
  backgroundColor: COLORS.CREAM,
  borderRadius: 8,
  overflow: 'hidden',
});

const Name = styled(Body16)({
  textAlign: 'center',
});

type Props = {
  tag: TagType;
  onPress?: () => void;
};
const Tag: React.FC<Props> = ({tag, onPress}) => {
  return (
    <Container onPress={onPress}>
      <Name>{tag.name}</Name>
    </Container>
  );
};

export default Tag;
