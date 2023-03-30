import React from 'react';
import styled from 'styled-components/native';

import {Spacer4} from '../../../../lib/components/Spacers/Spacer';
import TouchableOpacity from '../../../../lib/components/TouchableOpacity/TouchableOpacity';
import {Body16} from '../../../../lib/components/Typography/Body/Body';
import {Display28} from '../../../../lib/components/Typography/Display/Display';

const Row = styled.View({
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
});

const FilterContainer = styled(TouchableOpacity)({
  minWidth: 110,
  backgroundColor: '#A9DAC1',
  borderRadius: 16,
  padding: 11,
});

const IconWrapper = styled.View({
  width: 22,
  height: 22,
});

const FilterStatus: React.FC<{
  Icon: React.FC;
  onPress: () => void;
  heading: string;
  description: string;
}> = ({onPress, Icon, heading, description}) => (
  <FilterContainer onPress={onPress}>
    <Row>
      <IconWrapper>
        <Icon />
      </IconWrapper>
      <Display28>{heading}</Display28>
    </Row>
    <Spacer4 />
    <Body16>{description}</Body16>
  </FilterContainer>
);

export default FilterStatus;
