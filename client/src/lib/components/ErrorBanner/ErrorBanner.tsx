import React, {useCallback, useEffect, useMemo, useState} from 'react';
import Animated, {FadeInUp} from 'react-native-reanimated';
import {
  GestureDetector,
  Gesture,
  Directions,
} from 'react-native-gesture-handler';

import {
  ActionConfig,
  ErrorBannerContext,
} from '../../contexts/ErrorBannerContext';
import styled from 'styled-components/native';
import LottiePlayer from '../LottiePlayer/LottiePlayer';
import {SPACINGS} from '../../constants/spacings';
import errorAnimation from '../../../assets/animations/error.json';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {View} from 'react-native';
import {Body14} from '../Typography/Body/Body';
import {Heading16} from '../Typography/Heading/Heading';
import Button from '../Buttons/Button';
import {CloseIcon} from '../Icons';
import TouchableOpacity from '../TouchableOpacity/TouchableOpacity';
import SETTINGS from '../../constants/settings';

const Container = styled(Animated.View)<{top: number; hasAction?: boolean}>(
  ({top, hasAction}) => ({
    position: 'absolute',
    top: Math.max(top, SPACINGS.SIXTEEN),
    left: 0,
    right: 0,
    borderRadius: SPACINGS.SIXTEEN,
    padding: SPACINGS.EIGHT,
    marginHorizontal: SPACINGS.SIXTEEN,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: hasAction ? 'center' : undefined,
    backgroundColor: 'rgba(244, 191, 183, 1)',
    ...SETTINGS.BOXSHADOW,
  }),
);

const Left = styled.View({
  flex: 3,
  flexDirection: 'row',
  justifyContent: 'flex-start',
  alignItems: 'center',
});

const Right = styled.View<{hasAction?: boolean}>(({hasAction}) => ({
  flex: hasAction ? 2 : 1,
  flexDirection: 'row',
  justifyContent: 'flex-end',
}));

const Lottie = styled(LottiePlayer)({
  width: 44,
  height: 44,
  marginTop: -4,
  marginBottom: -4,
  marginRight: SPACINGS.SIXTEEN,
});

const WrapText = styled(Body14)({flexShrink: 0});

const ActionButton = styled(Button)({
  height: SPACINGS.THIRTYSIX,
});

const CloseButton = styled(TouchableOpacity)({
  height: 21,
  width: 21,
});

const ErrorBanner: React.FC<{children: React.ReactNode}> = ({children}) => {
  const top = useSafeAreaInsets().top;
  const [header, setHeader] = useState('');
  const [message, setMessage] = useState('');
  const [actionConfig, setActionComponent] = useState<ActionConfig | undefined>(
    undefined,
  );
  const [autoClose, setAutoClose] = useState<boolean | undefined>();
  const [onCloseCallback, setOnCloseCallback] = useState(() => () => {});

  const showError = useCallback(
    (
      hdr: string,
      msg: string,
      options?: {
        actionConfig?: ActionConfig;
        disableAutoClose?: boolean;
        onClose?: () => void;
      },
    ) => {
      setHeader(hdr);
      setMessage(msg);
      setActionComponent(options?.actionConfig);
      setAutoClose(options?.disableAutoClose ? false : true);
      setOnCloseCallback(() => options?.onClose ?? (() => {}));
    },
    [],
  );

  const reset = useCallback(() => {
    setHeader('');
    setMessage('');
    setActionComponent(undefined);
    setAutoClose(undefined);
  }, []);

  const onClose = useCallback(() => {
    onCloseCallback();
    reset();
  }, [onCloseCallback, reset]);

  const onAction = useCallback(() => {
    if (actionConfig?.action) {
      actionConfig.action();
    }
    reset();
  }, [actionConfig, reset]);

  const contextValue = useMemo(() => {
    return {showError};
  }, [showError]);

  useEffect(() => {
    let timeout: NodeJS.Timeout | undefined;
    if (autoClose === true) {
      timeout = setTimeout(reset, 5000);
    }

    return () => clearTimeout(timeout);
  }, [autoClose, reset]);

  const swipeUpGesture = useMemo(
    () => Gesture.Fling().direction(Directions.UP).onEnd(onClose),
    [onClose],
  );

  return (
    <ErrorBannerContext.Provider value={contextValue}>
      {children}

      {header && message && (
        <GestureDetector gesture={swipeUpGesture}>
          <Container
            entering={FadeInUp.duration(500)}
            hasAction={Boolean(actionConfig)}
            top={top}>
            <Left>
              <Lottie source={errorAnimation} repeat paused={false} />
              <View>
                <Heading16>{header}</Heading16>
                <WrapText>{message}</WrapText>
              </View>
            </Left>

            <Right hasAction={Boolean(actionConfig)}>
              {actionConfig ? (
                <ActionButton small variant="secondary" onPress={onAction}>
                  {actionConfig.text}
                </ActionButton>
              ) : (
                <CloseButton onPress={onClose}>
                  <CloseIcon />
                </CloseButton>
              )}
            </Right>
          </Container>
        </GestureDetector>
      )}
    </ErrorBannerContext.Provider>
  );
};

export default ErrorBanner;
