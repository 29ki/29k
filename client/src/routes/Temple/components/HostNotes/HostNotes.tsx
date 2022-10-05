import React from 'react';
import styled from 'styled-components/native';
import Button from '../../../../common/components/Buttons/Button';
import {PlusIcon} from '../../../../common/components/Icons';
import NavButton from './NavButton';

import {Body14} from '../../../../common/components/Typography/Body/Body';
import ProgressBar from '../ProgressBar/ProgressBar';
import SETTINGS from '../../../../common/constants/settings';
import {COLORS} from '../../../../../../shared/src/constants/colors';
import {BackwardCircleIcon} from '../../../../common/components/Icons/BackwardCircle/BackwardCircle';
import {ForwardCircleIcon} from '../../../../common/components/Icons/ForwardCircle/ForwardCircle';
import {
  Spacer8,
  TopSafeArea,
} from '../../../../common/components/Spacers/Spacer';
import Gutters from '../../../../common/components/Gutters/Gutters';
import useTempleExercise from '../../hooks/useTempleExercise';

// Toggle open close
// animate icon change
// animate content toggle
// Go to next note
// ProgressBar and notes numbering
// Progressbar to replicate exercise slides?
// Show note numbering based on?

const Wrapper = styled.View({
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  borderBottomLeftRadius: SETTINGS.BORDER_RADIUS.CARDS,
  borderBottomRightRadius: SETTINGS.BORDER_RADIUS.CARDS,
  backgroundColor: COLORS.WHITE,
  ...SETTINGS.BOXSHADOW,
});
const Row = styled.View({
  flexDirection: 'row',
  alignItems: 'center',
});
const NavWrapper = styled.View({
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
});

const Progress = styled(ProgressBar)({
  flex: 1,
});

const HostNotes = () => {
  const exercise = useTempleExercise();

  console.log(exercise);
  return (
    <Wrapper>
      <TopSafeArea />
      <Gutters>
        <Spacer8 />
        <Row>
          <Progress index={1} length={5} />
          <Spacer8 />
          <Button
            small
            onPress={() => {}}
            RightIcon={PlusIcon}
            variant="tertiary">
            {'Notes'}
          </Button>
        </Row>
        <Spacer8 />
        <Body14>{'NOTES JOE'}</Body14>
        <NavWrapper>
          <NavButton Icon={BackwardCircleIcon} />
          <Body14>{'1/2'}</Body14>
          <NavButton Icon={ForwardCircleIcon} />
        </NavWrapper>
        <Spacer8 />
      </Gutters>
    </Wrapper>
  );
};

export default HostNotes;
