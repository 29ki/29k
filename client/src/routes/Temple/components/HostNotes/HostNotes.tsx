import React from 'react';
import styled from 'styled-components/native';
import Button from '../../../../common/components/Buttons/Button';
import {
  PlusIcon,
  ForwardCircleIcon,
  BackwardCircleIcon,
} from '../../../../common/components/Icons';
import NavButton from './NavButton';

import {Body14} from '../../../../common/components/Typography/Body/Body';
import {COLORS} from '../../../../common/constants/colors';
import ProgressBar from '../ProgressBar/ProgressBar';
import {SPACINGS} from '../../../../common/constants/spacings';
import SETTINGS from '../../../../common/constants/settings';

const Wrapper = styled.View({
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  padding: SPACINGS.SIXTEEN,
  borderBottomLeftRadius: SETTINGS.BORDER_RADIUS.CARDS,
  borderBottomRightRadius: SETTINGS.BORDER_RADIUS.CARDS,
  backgroundColor: COLORS.WHITE,
  ...SETTINGS.BOXSHADOW,
});
const Row = styled.View({flexDirection: 'row'});

const HostNotes = () => (
  <Wrapper>
    <Row>
      <Button onPress={() => {}} RightIcon={PlusIcon} variant="tertiary">
        {'Notes'}
      </Button>
      <ProgressBar index={1} length={5} />
    </Row>
    <Body14>
      {
        'Now we’ll take a minute to reflect on our own. How did this meditation affect you? What from this can you bring into the rest of your day? There is no right or wrong here, our answers are our own.'
      }
    </Body14>
    <Row>
      <NavButton Icon={BackwardCircleIcon} />
      <NavButton Icon={ForwardCircleIcon} />
    </Row>
  </Wrapper>
);

export default HostNotes;
