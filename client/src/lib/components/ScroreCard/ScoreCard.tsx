import React from 'react';
import styled from 'styled-components/native';

import {Spacer4} from '../../../lib/components/Spacers/Spacer';
import TouchableOpacity from '../../../lib/components/TouchableOpacity/TouchableOpacity';
import {Body16} from '../../../lib/components/Typography/Body/Body';
import {Display28} from '../../../lib/components/Typography/Display/Display';
import {COLORS} from '../../../../../shared/src/constants/colors';

export const HEIGHT = 110;

const Row = styled.View({
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
});

const Container = styled(TouchableOpacity)<{selected: boolean}>(
  ({selected}) => ({
    backgroundColor: COLORS.MEDIUM_GREEN,
    borderRadius: 16,
    padding: 11,
    flex: 1,
    height: HEIGHT,
    border: selected ? `1px ${COLORS.PRIMARY}` : 'none',
    flexGrow: 1 / 2,
  }),
);

const IconWrapper = styled.View({
  width: 30,
  height: 30,
});

const ScoreCard: React.FC<{
  Icon: React.FC;
  onPress?: () => void;
  heading: string;
  description: string;
  selected?: boolean;
  disabled?: boolean;
}> = ({
  onPress = () => {},
  Icon,
  heading,
  description,
  selected = false,
  disabled = false,
}) => (
  <Container selected={selected} onPress={onPress} disabled={disabled}>
    <Row>
      <IconWrapper>
        <Icon />
      </IconWrapper>
      <Display28>{heading}</Display28>
    </Row>
    <Spacer4 />
    <Body16 adjustsFontSizeToFit numberOfLines={2}>
      {description}
    </Body16>
  </Container>
);

export default ScoreCard;
