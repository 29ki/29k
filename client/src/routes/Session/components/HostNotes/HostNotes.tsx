import React, {useCallback, useEffect, useRef, useState} from 'react';
import styled from 'styled-components/native';
import {FlatList} from 'react-native-gesture-handler';
import Animated, {
  Easing,
  FadeInUp,
  SlideOutUp,
  FadeIn,
} from 'react-native-reanimated';
import {useTranslation} from 'react-i18next';
import {
  Dimensions,
  NativeScrollEvent,
  NativeSyntheticEvent,
  View,
  ViewStyle,
} from 'react-native';
import GestureRecognizer from 'react-native-swipe-gestures';

import {COLORS} from '../../../../../../shared/src/constants/colors';
import SETTINGS from '../../../../lib/constants/settings';
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

const NotesNavBtn = styled(NavButton)(({disabled}) => ({
  opacity: disabled ? 0 : 1,
}));

const ShadowWrapper = styled.View({
  ...SETTINGS.BOXSHADOW,
  borderBottomRightRadius: SETTINGS.BORDER_RADIUS.CARDS, // adding borderRadius somehow fixes elevation not showing on Android
  borderBottomLeftRadius: SETTINGS.BORDER_RADIUS.CARDS, // adding borderRadius somehow fixes elevation not showing on Android
});

const Wrapper = styled.View({
  borderBottomLeftRadius: SETTINGS.BORDER_RADIUS.CARDS,
  borderBottomRightRadius: SETTINGS.BORDER_RADIUS.CARDS,
  backgroundColor: COLORS.WHITE,
  zIndex: 2,
});

const HandleContainerTopBar = styled(Animated.View).attrs({
  entering: FadeIn.duration(600),
})({
  padding: SPACINGS.FOUR,
});

const HandleContainer = styled.View({
  padding: SPACINGS.FOUR,
});

// Same styling as https://github.com/gorhom/react-native-bottom-sheet
const Handle = styled.View({
  alignSelf: 'center',
  width: (7.5 * Dimensions.get('window').width) / 100,
  height: 4,
  borderRadius: 4,
  backgroundColor: COLORS.GREYDARK,
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
  marginTop: -25,
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
  children?: React.ReactNode;
};

const HostNotes: React.FC<HostNotesProps> = ({
  introPortal,
  style,
  children,
}) => {
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

  return (
    <View style={style}>
      <ShadowWrapper>
        <Wrapper
          onLayout={event => {
            setContainerWidth(event.nativeEvent.layout.width);
          }}>
          <TopSafeArea />
          <Gutters>
            <Spacer4 />
            <GestureRecognizer onSwipeDown={() => setShowNotes(true)}>
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
                  onPress={() => setShowNotes(prevShowNotes => !prevShowNotes)}
                />
              </TopBar>
              {!showNotes && notes && (
                <HandleContainerTopBar>
                  <Handle />
                </HandleContainerTopBar>
              )}
            </GestureRecognizer>
            <Spacer4 />
          </Gutters>
        </Wrapper>
        {showNotes && notes && (
          <NotesWrapper>
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
              <GestureRecognizer onSwipeUp={() => setShowNotes(false)}>
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
                <HandleContainer>
                  <Handle />
                </HandleContainer>
              </GestureRecognizer>
            </Gutters>
            <Spacer8 />
          </NotesWrapper>
        )}
      </ShadowWrapper>
      {children && children}
    </View>
  );
};

export default HostNotes;
