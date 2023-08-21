import React, {useCallback, useMemo, useState} from 'react';
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

const Container = styled.View<{top: number; hasAction?: boolean}>(
  ({top, hasAction}) => ({
    position: 'absolute',
    top: top,
    left: 0,
    right: 0,
    borderRadius: SPACINGS.SIXTEEN,
    padding: SPACINGS.EIGHT,
    marginHorizontal: SPACINGS.SIXTEEN,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: hasAction ? 'center' : undefined,
    backgroundColor: 'rgba(244, 191, 183, 1)',
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

  const onShowError = useCallback(
    (hdr: string, msg: string, action?: ActionConfig) => {
      setHeader(hdr);
      setMessage(msg);
      setActionComponent(action);
    },
    [],
  );

  const onClose = useCallback(() => {
    setHeader('');
    setMessage('');
    setActionComponent(undefined);
  }, []);

  const contextValue = useMemo(() => {
    return {showError: onShowError};
  }, [onShowError]);

  return (
    <ErrorBannerContext.Provider value={contextValue}>
      {children}

      {header && message && (
        <Container hasAction={Boolean(actionConfig)} top={top}>
          <Left>
            <Lottie source={errorAnimation} repeat paused={false} />
            <View>
              <Heading16>{header}</Heading16>
              <WrapText>{message}</WrapText>
            </View>
          </Left>

          <Right hasAction={Boolean(actionConfig)}>
            {actionConfig ? (
              <ActionButton
                small
                variant="secondary"
                onPress={actionConfig.action}>
                {actionConfig.text}
              </ActionButton>
            ) : (
              <CloseButton onPress={onClose}>
                <CloseIcon />
              </CloseButton>
            )}
          </Right>
        </Container>
      )}
    </ErrorBannerContext.Provider>
  );
};

export default ErrorBanner;
