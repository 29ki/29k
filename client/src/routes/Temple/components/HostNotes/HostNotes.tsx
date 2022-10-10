import React, {useEffect, useRef, useState} from 'react';
import styled from 'styled-components/native';
import {FlatList} from 'react-native-gesture-handler';
import Animated, {
  Easing,
  FadeInUp,
  RotateInUpLeft,
  RotateInUpRight,
  RotateOutDownLeft,
  RotateOutDownRight,
  SlideOutUp,
} from 'react-native-reanimated';
import {useTranslation} from 'react-i18next';

import Button from '../../../../common/components/Buttons/Button';
import {MinusIcon, PlusIcon} from '../../../../common/components/Icons';
import NavButton from './NavButton';
import {Body14} from '../../../../common/components/Typography/Body/Body';
import ProgressBar from '../ProgressBar/ProgressBar';
import SETTINGS from '../../../../common/constants/settings';
import {COLORS} from '../../../../../../shared/src/constants/colors';
import {HostNote} from '../../../../../../shared/src/types/Content';
import {BackwardCircleIcon} from '../../../../common/components/Icons/BackwardCircle/BackwardCircle';
import {ForwardCircleIcon} from '../../../../common/components/Icons/ForwardCircle/ForwardCircle';
import {
  Spacer28,
  Spacer8,
  TopSafeArea,
} from '../../../../common/components/Spacers/Spacer';
import Gutters from '../../../../common/components/Gutters/Gutters';
import useTempleExercise from '../../hooks/useTempleExercise';
import NS from '../../../../lib/i18n/constants/namespaces';

const BoxShadowWrapper = styled.View({...SETTINGS.BOXSHADOW});
const Wrapper = styled.View({
  borderBottomLeftRadius: SETTINGS.BORDER_RADIUS.CARDS,
  borderBottomRightRadius: SETTINGS.BORDER_RADIUS.CARDS,
  backgroundColor: COLORS.WHITE,
  zIndex: 2,
  elevation: 1,
});

const TopBar = styled.View({
  flexDirection: 'row',
  alignItems: 'center',
  elevation: 2,
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
  entering: FadeInUp.duration(300).easing(Easing.bezierFn(0.34, 1.56, 0.64, 1)),
  exiting: SlideOutUp.duration(600),
})({
  borderBottomLeftRadius: SETTINGS.BORDER_RADIUS.CARDS,
  borderBottomRightRadius: SETTINGS.BORDER_RADIUS.CARDS,
  backgroundColor: COLORS.WHITE,
  zIndex: 1,
  elevation: 1,
  marginTop: -25,
});
const Navigation = styled.View({
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
});

const ListItem = styled.View<{containerWidth: number}>(props => ({
  width: props.containerWidth,
}));

type HostNotesProps = {
  notes: HostNote[];
};

const HostNotes: React.FC<HostNotesProps> = ({notes}) => {
  const listRef = useRef<FlatList>(null);
  const [showNotes, setShowNotes] = useState(false);
  const [containerWidth, setContainerWidth] = useState(0);
  const [activeIndex, setActiveIndex] = useState(0);
  const exercise = useTempleExercise();
  const {t} = useTranslation(NS.COMPONENT.HOST_NOTES);

  useEffect(() => {
    listRef.current?.scrollToIndex({animated: true, index: activeIndex});
  }, [activeIndex]);

  return (
    <BoxShadowWrapper>
      <Wrapper
        onLayout={event => {
          setContainerWidth(event.nativeEvent.layout.width);
        }}>
        <TopSafeArea />
        <Spacer8 />
        <Gutters>
          <TopBar>
            <Progress
              index={exercise?.slide.index}
              length={exercise?.slides.length}
            />
            <Spacer8 />
            <Button
              small
              onPress={() => setShowNotes(!showNotes)}
              RightIcon={showNotes ? AnimatedMinusIcon : AnimatedPlusIcon}
              variant="tertiary">
              {t('notes')}
            </Button>
          </TopBar>
          <Spacer8 />
        </Gutters>
      </Wrapper>
      {showNotes && (
        <NotesWrapper>
          <Gutters>
            <Spacer28 />
            <FlatList
              getItemLayout={(data, index) => ({
                length: containerWidth,
                offset: containerWidth * index,
                index,
              })}
              ref={listRef}
              data={notes}
              showsHorizontalScrollIndicator={false}
              ItemSeparatorComponent={Spacer8}
              scrollEnabled={notes?.length > 1}
              renderItem={({item}) => (
                <ListItem containerWidth={containerWidth}>
                  <Body14>{item.text}</Body14>
                </ListItem>
              )}
              horizontal
            />
            <Navigation>
              <NavButton
                onPress={() => setActiveIndex(activeIndex - 1)}
                Icon={BackwardCircleIcon}
                disabled={activeIndex <= 0}
              />
              <Body14>{`${activeIndex + 1} / ${notes?.length}`}</Body14>
              <NavButton
                onPress={() => setActiveIndex(activeIndex + 1)}
                Icon={ForwardCircleIcon}
                disabled={activeIndex >= notes?.length - 1}
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
