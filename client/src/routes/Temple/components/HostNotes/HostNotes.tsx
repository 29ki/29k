import React, {useState} from 'react';
import styled from 'styled-components/native';
import Button from '../../../../common/components/Buttons/Button';
import {MinusIcon, PlusIcon} from '../../../../common/components/Icons';
import NavButton from './NavButton';

import {Body14} from '../../../../common/components/Typography/Body/Body';
import ProgressBar from '../ProgressBar/ProgressBar';
import SETTINGS from '../../../../common/constants/settings';
import {COLORS} from '../../../../../../shared/src/constants/colors';
import {BackwardCircleIcon} from '../../../../common/components/Icons/BackwardCircle/BackwardCircle';
import {ForwardCircleIcon} from '../../../../common/components/Icons/ForwardCircle/ForwardCircle';
import {
  Spacer28,
  Spacer8,
  TopSafeArea,
} from '../../../../common/components/Spacers/Spacer';
import Gutters from '../../../../common/components/Gutters/Gutters';
import useTempleExercise from '../../hooks/useTempleExercise';
import Animated, {
  Easing,
  FadeInUp,
  RotateInUpLeft,
  RotateInUpRight,
  RotateOutDownLeft,
  RotateOutDownRight,
  SlideOutUp,
} from 'react-native-reanimated';

// Toggle open close
// animate icon change
// animate content toggle
// Go to next note
// ProgressBar and notes numbering
// Progressbar to replicate exercise slides?
// Show note numbering based on?

const BoxShadowWrapper = styled.View({...SETTINGS.BOXSHADOW});
const Wrapper = styled.View({
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  borderBottomLeftRadius: SETTINGS.BORDER_RADIUS.CARDS,
  borderBottomRightRadius: SETTINGS.BORDER_RADIUS.CARDS,
  backgroundColor: COLORS.WHITE,
  zIndex: 2,
});
const Row = styled.View({
  flexDirection: 'row',
  alignItems: 'center',
  zIndex: 2,
});
const NavWrapper = styled.View({
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
});

const Progress = styled(ProgressBar)({
  flex: 1,
});

const AnimatedPlusIcon = () => {
  return (
    <Animated.View
      entering={RotateInUpRight.duration(300)}
      exiting={RotateOutDownRight.duration(300)}>
      <PlusIcon />
    </Animated.View>
  );
};
const AnimatedMinusIcon = () => {
  return (
    <Animated.View
      entering={RotateInUpLeft.duration(300)}
      exiting={RotateOutDownLeft.duration(300)}>
      <MinusIcon />
    </Animated.View>
  );
};

const NotesWrapper = styled(Animated.View).attrs({
  entering: FadeInUp.duration(300).easing(Easing.bezier(0.34, 1.56, 0.64, 1)),
  exiting: SlideOutUp.duration(600),
})({
  borderBottomLeftRadius: SETTINGS.BORDER_RADIUS.CARDS,
  borderBottomRightRadius: SETTINGS.BORDER_RADIUS.CARDS,
  backgroundColor: COLORS.WHITE,
  zIndex: 1,
  marginTop: -25,
});
const Navigation = styled.View({
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
});
const TextWrapper = styled.View({
  overflow: 'hidden',
});

type HostNotesProps = {
  exercise: object;
};

const HostNotes: React.FC<HostNotesProps> = () => {
  const [showNotes, setShowNotes] = useState(false);
  let [activeIndex, setActiveIndex] = useState(0);
  const exercise = useTempleExercise();

  console.log(exercise);
  return (
    <BoxShadowWrapper>
    <Wrapper>
      <TopSafeArea />
      <Gutters>
        <Spacer8 />
        <Gutters>
          <TopBar>
          <Progress index={1} length={5} />
          <Spacer8 />
          <Button
            small
            onPress={() => setShowNotes(!showNotes)}
            RightIcon={!showNotes ? AnimatedMinusIcon : AnimatedPlusIcon}
            variant="tertiary">
            {'Notes'}
          </Button>
          </TopBar>
        <Spacer8 />
      </Gutters>
    </Wrapper>
      {!showNotes && (
        <NotesWrapper>
          <Gutters>
            <Spacer28 />
            <Navigation>
              <NavButton
                onPress={onBackward}
                Icon={BackwardCircleIcon}
                disabled={activeIndex <= 0}
              />
              <Body14>{`${activeIndex + 1} / ${portalNotes.length}`}</Body14>
              <NavButton
                onPress={onForward}
                Icon={ForwardCircleIcon}
                disabled={activeIndex >= portalNotes.length - 1}
              />
            </Navigation>
          </Gutters>
          <Spacer8 />
        </NotesWrapper>
      )}
    </BoxShadowWrapper>
  );
};

export default HostNotes;
