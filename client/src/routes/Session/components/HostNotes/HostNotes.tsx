import React, {useRef, useState} from 'react';
import styled from 'styled-components/native';
import {FlatList} from 'react-native-gesture-handler';
import Animated, {Easing, FadeInUp, SlideOutUp} from 'react-native-reanimated';
import {useTranslation} from 'react-i18next';
import {
  NativeScrollEvent,
  NativeSyntheticEvent,
  View,
  ViewStyle,
} from 'react-native';

import {COLORS} from '../../../../../../shared/src/constants/colors';
import SETTINGS from '../../../../common/constants/settings';
import {SPACINGS} from '../../../../common/constants/spacings';

import useSessionExercise from '../../hooks/useSessionExercise';

import {BackwardCircleIcon} from '../../../../common/components/Icons/BackwardCircle/BackwardCircle';
import {Body14} from '../../../../common/components/Typography/Body/Body';
import {ForwardCircleIcon} from '../../../../common/components/Icons/ForwardCircle/ForwardCircle';
import Gutters from '../../../../common/components/Gutters/Gutters';
import Markdown from '../../../../common/components/Typography/Markdown/Markdown';
import NavButton from './NavButton';
import ProgressBar from '../ProgressBar/ProgressBar';
import {
  Spacer32,
  Spacer4,
  Spacer8,
  TopSafeArea,
} from '../../../../common/components/Spacers/Spacer';
import ToggleButton from './ToggleButton';

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
  const [activeIndex, setActiveIndex] = useState(0);
  const exercise = useSessionExercise();
  const {t} = useTranslation('Component.HostNotes');

  const calculatePageIndex = (e: NativeSyntheticEvent<NativeScrollEvent>) =>
    setActiveIndex(
      Math.round(e?.nativeEvent?.contentOffset?.x / containerWidth),
    );

  const notes = introPortal
    ? exercise?.introPortal?.hostNotes
    : exercise?.slide.current.hostNotes;

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
            <TopBar>
              <Progress
                index={exercise?.slide.index}
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
                onContentSizeChange={() =>
                  listRef.current?.scrollToIndex({
                    animated: false,
                    index: 0,
                  })
                }
                pagingEnabled
                onScroll={calculatePageIndex}
                keyExtractor={(_, i) => `notes-${i}`}
                initialScrollIndex={activeIndex}
                snapToInterval={listItemWidth}
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
                <NavButton
                  onPress={() => {
                    listRef.current?.scrollToIndex({
                      index: activeIndex - 1,
                    });
                  }}
                  Icon={BackwardCircleIcon}
                  disabled={activeIndex <= 0}
                />
                <Body14>{`${activeIndex + 1} / ${notes.length}`}</Body14>
                <NavButton
                  onPress={() =>
                    listRef.current?.scrollToIndex({
                      index: activeIndex + 1,
                    })
                  }
                  Icon={ForwardCircleIcon}
                  disabled={activeIndex >= notes.length - 1}
                />
              </Navigation>
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
