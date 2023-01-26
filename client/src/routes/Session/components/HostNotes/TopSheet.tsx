import React, {useCallback, useEffect, useState} from 'react';
import {Dimensions, LayoutChangeEvent, View, ViewStyle} from 'react-native';
import {PanGestureHandler} from 'react-native-gesture-handler';
import Animated, {
  runOnJS,
  useAnimatedGestureHandler,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withSpring,
  WithSpringConfig,
} from 'react-native-reanimated';
import styled from 'styled-components/native';
import {COLORS} from '../../../../../../shared/src/constants/colors';
import SETTINGS from '../../../../lib/constants/settings';

const springConfig: WithSpringConfig = {
  damping: 50,
  mass: 0.3,
  stiffness: 120,
  overshootClamping: true,
  restSpeedThreshold: 0.3,
  restDisplacementThreshold: 0.3,
};

const DRAG_BUFFER = 40;
const HANDLE_HEIGHT = 24;

const Container = styled.View({
  ...SETTINGS.BOXSHADOW,
});

const SheetWrapper = styled(Animated.View)({
  justifyContent: 'flex-end',
  backgroundColor: COLORS.WHITE,
  borderBottomLeftRadius: SETTINGS.BORDER_RADIUS.CARDS,
  borderBottomRightRadius: SETTINGS.BORDER_RADIUS.CARDS,
  overflow: 'hidden',
});

const Content = styled(View)({
  flexShrink: 0,
  position: 'absolute',
  bottom: HANDLE_HEIGHT,
  left: 0,
  right: 0,
});

// Same styling as https://github.com/gorhom/react-native-bottom-sheet
const Handle = styled.View({
  alignSelf: 'center',
  width: (7.5 * Dimensions.get('window').width) / 100,
  height: 4,
  margin: (HANDLE_HEIGHT - 4) / 2,
  borderRadius: 4,
  backgroundColor: COLORS.GREYDARK,
  flexShrink: 0,
});

type SheetProps = {
  expand?: boolean;
  onChange?: (expanded: boolean) => void;
  style?: ViewStyle;
  children: React.ReactNode;
};
const TopSheet = React.memo<SheetProps>(
  ({expand = false, onChange = () => {}, style, children}) => {
    const [contentHeight, setContentHeight] = useState(0);

    // Fixed values (for snap positions)
    const minimisedHeight = HANDLE_HEIGHT;
    const expandedHeight = contentHeight + HANDLE_HEIGHT;

    // Animated values
    const expanded = useSharedValue(expand);
    const sheetHeight = useSharedValue(
      expand ? expandedHeight : minimisedHeight,
    );

    const updateContentHeight = useCallback(
      ({
        nativeEvent: {
          layout: {height},
        },
      }: LayoutChangeEvent) => {
        // Height can diff on decimals - only update if diff is > 1
        if (Math.abs(height - contentHeight) > 1) {
          setContentHeight(height);
        }
      },
      [setContentHeight, contentHeight],
    );

    const updateHeight = useCallback(
      (height: number) => {
        'worklet';
        sheetHeight.value = withSpring(height, springConfig);
      },
      [sheetHeight],
    );

    useEffect(() => {
      // React to content height change
      updateHeight(expanded.value ? expandedHeight : minimisedHeight);
    }, [updateHeight, expandedHeight, minimisedHeight, expanded]);

    useEffect(() => {
      // React to expand prop change
      if (expanded.value !== expand) {
        expanded.value = expand;
        updateHeight(expand ? expandedHeight : minimisedHeight);
      }
    }, [expanded, updateHeight, minimisedHeight, expandedHeight, expand]);

    useDerivedValue(() => {
      // Run onChange callback
      runOnJS(onChange)(expanded.value);
    }, [expanded.value]);

    const onGestureEvent = useAnimatedGestureHandler(
      {
        // Set the context value to the sheet's current height value
        onStart: (_ev, ctx: any) => {
          'worklet';
          ctx.offsetY = sheetHeight.value;
        },
        // Update the sheet's height value based on the gesture
        onActive: (ev, ctx: any) => {
          'worklet';
          const height = ctx.offsetY + ev.translationY;
          if (height >= minimisedHeight) {
            sheetHeight.value = height;
          }
        },
        // Snap the sheet to the correct position once the gesture ends
        onEnd: () => {
          // 'worklet' directive is required for animations to work based on shared values
          'worklet';

          // Update the sheet's position with spring animation
          if (
            !expanded.value &&
            sheetHeight.value > minimisedHeight + DRAG_BUFFER
          ) {
            updateHeight(expandedHeight);
            expanded.value = true;
          } else if (
            expanded.value &&
            sheetHeight.value < expandedHeight - DRAG_BUFFER
          ) {
            updateHeight(minimisedHeight);
            expanded.value = false;
          } else {
            updateHeight(expanded.value ? expandedHeight : minimisedHeight);
          }
        },
      },
      [updateHeight, minimisedHeight, expandedHeight],
    );

    const sheetHeightAnimatedStyle = useAnimatedStyle(() => ({
      // The 'worklet' directive is included with useAnimatedStyle hook by default
      height: sheetHeight.value,
    }));

    return (
      <Container style={style}>
        <PanGestureHandler onGestureEvent={onGestureEvent}>
          <SheetWrapper style={sheetHeightAnimatedStyle}>
            <Content onLayout={updateContentHeight}>{children}</Content>
            <Handle />
          </SheetWrapper>
        </PanGestureHandler>
      </Container>
    );
  },
);

export default TopSheet;
