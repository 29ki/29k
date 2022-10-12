import React, {useEffect, useRef, useState} from 'react';
import styled from 'styled-components/native';
import {FlatList} from 'react-native-gesture-handler';
import Animated, {Easing, FadeInUp, SlideOutUp} from 'react-native-reanimated';
import {useTranslation} from 'react-i18next';
import {ViewStyle} from 'react-native';

import {COLORS} from '../../../../../../shared/src/constants/colors';
import NS from '../../../../lib/i18n/constants/namespaces';
import SETTINGS from '../../../../common/constants/settings';
import {SPACINGS} from '../../../../common/constants/spacings';

import useTempleExercise from '../../hooks/useTempleExercise';

import {BackwardCircleIcon} from '../../../../common/components/Icons/BackwardCircle/BackwardCircle';
import {Body14} from '../../../../common/components/Typography/Body/Body';
import {ForwardCircleIcon} from '../../../../common/components/Icons/ForwardCircle/ForwardCircle';
import Gutters from '../../../../common/components/Gutters/Gutters';
import Markdown from '../../../../common/components/Typography/Markdown/Markdown';
import NavButton from './NavButton';
import ProgressBar from '../ProgressBar/ProgressBar';
import {
  Spacer28,
  Spacer8,
  TopSafeArea,
} from '../../../../common/components/Spacers/Spacer';
import ToggleButton from './ToggleButton';

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
  width: props.containerWidth - SPACINGS.THIRTYTWO,
}));

type HostNotesProps = {
  introPortal?: boolean;
  style?: ViewStyle;
  children?: React.ReactNode;
};

const HostNotes: React.FC<HostNotesProps> = ({
  introPortal,
  style,
  children,
}) => {
  const listRef = useRef<FlatList>(null);
  const [showNotes, setShowNotes] = useState(false);
  const [containerWidth, setContainerWidth] = useState(0);
  const [activeIndex, setActiveIndex] = useState(0);
  const exercise = useTempleExercise();
  const {t} = useTranslation(NS.COMPONENT.HOST_NOTES);

  const notes = introPortal
    ? exercise?.introPortal.hostNotes
    : exercise?.slide.current.hostNotes;

  useEffect(() => {
    listRef.current?.scrollToIndex({animated: true, index: activeIndex});
  }, [activeIndex]);

  useEffect(() => {
    setActiveIndex(0);
  }, [notes]);

  return (
    <BoxShadowWrapper style={style}>
      <Wrapper
        onLayout={event => {
          setContainerWidth(event.nativeEvent.layout.width);
        }}>
        <TopSafeArea />
        <Gutters>
          <TopBar>
            <Progress
              index={exercise?.slide.index}
              length={exercise?.slides.length}
            />
            <Spacer8 />
            <ToggleButton
              disabled={!notes}
              showNotes={showNotes}
              onPress={() => setShowNotes(prevShowNotes => !prevShowNotes)}
            />
          </TopBar>
          <Spacer8 />
        </Gutters>
      </Wrapper>
      {showNotes && notes && (
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
              scrollEnabled={Boolean(notes.length)}
              renderItem={({item}) => (
                <ListItem containerWidth={containerWidth}>
                  <Markdown>{item.text}</Markdown>
                </ListItem>
              )}
              horizontal
              initialScrollIndex={activeIndex}
            />
            <Navigation>
              <NavButton
                onPress={() =>
                  setActiveIndex(prevActiveIndex => prevActiveIndex - 1)
                }
                Icon={BackwardCircleIcon}
                disabled={activeIndex <= 0}
              />
              <Body14>{`${activeIndex + 1} / ${notes.length}`}</Body14>
              <NavButton
                onPress={() =>
                  setActiveIndex(prevActiveIndex => prevActiveIndex + 1)
                }
                Icon={ForwardCircleIcon}
                disabled={activeIndex >= notes.length - 1}
              />
            </Navigation>
          </Gutters>
          <Spacer8 />
        </NotesWrapper>
      )}
      {children && children}
    </BoxShadowWrapper>
  );
};

export default HostNotes;
