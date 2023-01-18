import React, {useCallback, useEffect, useRef, useState} from 'react';
import styled from 'styled-components/native';
import {FlatList} from 'react-native-gesture-handler';
import {useTranslation} from 'react-i18next';
import {
  NativeScrollEvent,
  NativeSyntheticEvent,
  View,
  ViewStyle,
} from 'react-native';

import {SPACINGS} from '../../../../lib/constants/spacings';

import useSessionExercise from '../../hooks/useSessionExercise';
import useSessionSlideState from '../../hooks/useSessionSlideState';

import {BackwardCircleIcon} from '../../../../lib/components/Icons/BackwardCircle/BackwardCircle';
import {Body14} from '../../../../lib/components/Typography/Body/Body';
import {ForwardCircleIcon} from '../../../../lib/components/Icons/ForwardCircle/ForwardCircle';
import Gutters from '../../../../lib/components/Gutters/Gutters';
import Markdown from '../../../../lib/components/Typography/Markdown/Markdown';
import NavButton from './NavButton';
import ProgressBar from '../ProgressBar/ProgressBar';
import {
  Spacer32,
  Spacer4,
  Spacer8,
  TopSafeArea,
} from '../../../../lib/components/Spacers/Spacer';
import ToggleButton from './ToggleButton';
import TopSheet from './TopSheet';
import {COLORS} from '../../../../../../shared/src/constants/colors';

const NotesNavBtn = styled(NavButton)(({disabled}) => ({
  opacity: disabled ? 0 : 1,
}));

const Wrapper = styled.View({
  backgroundColor: COLORS.WHITE,
  zIndex: 1,
});
const TopBar = styled.View({
  flexDirection: 'row',
  alignItems: 'center',
  elevation: 2,
});
const Progress = styled(ProgressBar)({
  flex: 1,
});

const Navigation = styled.View({
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
});

const ListItem = styled.View<{width: number}>(({width}) => ({
  width,
}));

type HostNotesProps = {
  introPortal?: boolean;
  style?: ViewStyle;
};

const HostNotes = React.memo<HostNotesProps>(({introPortal, style}) => {
  const listRef = useRef<FlatList>(null);
  const [showNotes, setShowNotes] = useState(introPortal ? true : false);
  const [containerWidth, setContainerWidth] = useState(0);
  const listItemWidth = containerWidth - SPACINGS.THIRTYTWO;
  const [scroll, setScroll] = useState({index: 0, animated: false});
  const sessionSlideState = useSessionSlideState();
  const exercise = useSessionExercise();
  const {t} = useTranslation('Component.HostNotes');

  const notes = introPortal
    ? exercise?.introPortal?.hostNotes
    : sessionSlideState?.current.hostNotes;

  const calculatePageIndex = useCallback(
    (e: NativeSyntheticEvent<NativeScrollEvent>) =>
      setScroll({
        index: Math.round(e?.nativeEvent?.contentOffset?.x / containerWidth),
        animated: true,
      }),
    [containerWidth],
  );

  useEffect(() => setScroll({index: 0, animated: false}), [notes]);

  useEffect(
    () =>
      listRef.current?.scrollToIndex({
        animated: scroll.animated,
        index: scroll.index,
      }),
    [scroll.animated, scroll.index],
  );

  const toggleNotes = useCallback(
    () => setShowNotes(prevShowNotes => !prevShowNotes),
    [setShowNotes],
  );

  return (
    <View style={style}>
      <Wrapper
        onLayout={event => {
          setContainerWidth(event.nativeEvent.layout.width);
        }}>
        <TopSafeArea />
        <Gutters>
          <Spacer4 />
          <TopBar>
            <Progress
              index={sessionSlideState?.index}
              length={exercise?.slides.length}
            />
            <Spacer8 />
            <ToggleButton
              disabled={!notes}
              isToggled={showNotes}
              title={t('notes')}
              onPress={toggleNotes}
            />
          </TopBar>
        </Gutters>
      </Wrapper>
      {notes && (
        <TopSheet expand={showNotes} onChange={setShowNotes}>
          <Gutters>
            <Spacer32 />
            <FlatList
              getItemLayout={(data, index) => ({
                length: listItemWidth,
                offset: listItemWidth * index,
                index,
              })}
              ref={listRef}
              data={notes}
              pagingEnabled
              onMomentumScrollEnd={calculatePageIndex}
              keyExtractor={(_, i) => `notes-${i}`}
              initialScrollIndex={scroll.index}
              snapToInterval={listItemWidth}
              disableIntervalMomentum={true}
              showsHorizontalScrollIndicator={false}
              scrollEnabled={Boolean(notes.length)}
              renderItem={({item}) => (
                <ListItem width={listItemWidth}>
                  <Markdown>{item.text}</Markdown>
                </ListItem>
              )}
              horizontal
            />
            <Navigation>
              <NotesNavBtn
                onPress={() =>
                  setScroll({
                    index: scroll.index - 1,
                    animated: true,
                  })
                }
                Icon={BackwardCircleIcon}
                disabled={scroll.index <= 0}
              />
              <Body14>{`${scroll.index + 1} / ${notes.length}`}</Body14>
              <NotesNavBtn
                onPress={() =>
                  setScroll({
                    index: scroll.index + 1,
                    animated: true,
                  })
                }
                Icon={ForwardCircleIcon}
                disabled={scroll.index >= notes.length - 1}
              />
            </Navigation>
          </Gutters>
        </TopSheet>
      )}
    </View>
  );
});

export default HostNotes;
