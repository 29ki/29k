import React, {useEffect, useRef, useState, useCallback, Fragment} from 'react';
import {
  Dimensions,
  StyleSheet,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from 'react-native';
import Animated, {
  useSharedValue,
  withTiming,
  useAnimatedStyle,
} from 'react-native-reanimated';
import styled from 'styled-components/native';
import {COLORS} from '../../../../../../shared/src/constants/colors';
import {Spacer4} from '../../../../lib/components/Spacers/Spacer';
import Page1 from './Page1';
import Page2 from './Page2';
import Page3 from './Page3';
import {ScrollViewProps} from 'react-native';

const WINDOW_WIDTH = Dimensions.get('window').width;

const Page = styled.View({
  width: WINDOW_WIDTH,
  height: '75%',
  justifyContent: 'flex-end',
});

const ScrollView = styled(Animated.ScrollView).attrs({
  horizontal: true,
  pagingEnabled: true,
})({
  ...StyleSheet.absoluteFillObject,
});

const Dots = styled.View({
  position: 'absolute',
  left: 0,
  right: 0,
  top: '80%',
  justifyContent: 'center',
  flexDirection: 'row',
});

const Dot = styled(Animated.View)({
  width: 10,
  height: 10,
  borderRadius: 5,
  backgroundColor: COLORS.WHITE,
});

const AnimatedDot: React.FC<{active: boolean}> = ({active}) => {
  const opacity = useSharedValue(active ? 1 : 0.4);

  useEffect(() => {
    opacity.value = withTiming(active ? 1 : 0.4, {duration: 400});
  }, [opacity, active]);

  const style = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  return <Dot style={style} />;
};

type AboutCarouselProps = {
  onScroll: ScrollViewProps['onScroll'];
  onPageChange: (index: number, count: number) => void;
};
const AboutCarousel: React.FC<AboutCarouselProps> = ({
  onScroll,
  onPageChange,
}) => {
  const scrollViewRef = useRef<Animated.ScrollView>(null);
  const [pageCount, setPageCount] = useState(0);
  const [pageIndex, setPageIndex] = useState(0);

  const onContentLayout = useCallback(
    (width: number) => {
      setPageCount(Math.round(width / WINDOW_WIDTH));
    },
    [setPageCount],
  );

  const onMomentumScrollEnd = useCallback(
    (e: NativeSyntheticEvent<NativeScrollEvent>) => {
      const index = Math.round(e.nativeEvent.contentOffset.x / WINDOW_WIDTH);
      setPageIndex(index);
      onPageChange(index, pageCount);
    },
    [setPageIndex, onPageChange, pageCount],
  );

  return (
    <>
      <ScrollView
        ref={scrollViewRef}
        onContentSizeChange={onContentLayout}
        onScroll={onScroll}
        onMomentumScrollEnd={onMomentumScrollEnd}
        scrollEventThrottle={16}>
        <Page>
          <Page1 />
        </Page>
        <Page>
          <Page2 />
        </Page>
        <Page>
          <Page3 />
        </Page>
      </ScrollView>
      <Dots>
        <Spacer4 />
        {Array(pageCount)
          .fill(null)
          .map((_, index) => (
            <Fragment key={index}>
              <AnimatedDot active={index === pageIndex} />
              <Spacer4 />
            </Fragment>
          ))}
      </Dots>
    </>
  );
};

export default AboutCarousel;
