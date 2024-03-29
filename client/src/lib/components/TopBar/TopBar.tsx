import React from 'react';
import {StyleSheet, ViewStyle} from 'react-native';
import hexToRgba from 'hex-to-rgba';
import LinearGradient, {
  LinearGradientProps,
} from 'react-native-linear-gradient';
import styled from 'styled-components/native';
import {ArrowLeftIcon, EllipsisIcon} from '../Icons';
import CloseButton from '../Buttons/CloseButton/CloseButton';
import TouchableOpacity from '../TouchableOpacity/TouchableOpacity';
import {Spacer16, Spacer8} from '../Spacers/Spacer';
import {Body16} from '../Typography/Body/Body';

const Wrapper = styled.View<{backgroundColor?: string}>(
  ({backgroundColor}) => ({
    backgroundColor,
    zIndex: 1,
  }),
);

const Title = styled.View({
  ...StyleSheet.absoluteFillObject,
  alignItems: 'center',
  justifyContent: 'center',
});

const Row = styled.View({
  minHeight: 30,
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
});

const Content = styled.View({
  flex: 1,
  justifyContent: 'center',
});

type FadeProps = {
  backgroundColor: string;
};
const Fade = styled(LinearGradient).attrs<FadeProps>(({backgroundColor}) => ({
  colors: [hexToRgba(backgroundColor, 1), hexToRgba(backgroundColor, 0)],
  pointerEvents: 'none',
  // Fixes issue with types not being passed down properly from .attrs
}))<Optional<LinearGradientProps, 'colors'>>({
  position: 'absolute',
  height: 36,
  left: 0,
  right: 0,
  top: '100%',
  backgroundColor: 'none',
});

const Button = styled(TouchableOpacity).attrs({
  hitSlop: {
    left: 5,
    right: 5,
    top: 5,
    bottom: 5,
  },
})({
  width: 30,
  height: 30,
});

type TopBarProps = {
  backgroundColor?: string;
  onPressBack?: () => void;
  onPressEllipsis?: () => void;
  onPressClose?: () => void;
  fade?: boolean;
  title?: string;
  style?: ViewStyle;
  children?: React.ReactNode;
};

const TopBar: React.FC<TopBarProps> = ({
  backgroundColor,
  onPressBack,
  onPressEllipsis,
  onPressClose,
  fade,
  title,
  style,
  children,
}) => (
  <Wrapper style={style} backgroundColor={backgroundColor}>
    <Row>
      <Title>
        <Body16>{title}</Body16>
      </Title>
      {onPressBack && (
        <>
          <Spacer8 />
          <Button onPress={onPressBack}>
            <ArrowLeftIcon />
          </Button>
        </>
      )}
      <Content>{children}</Content>
      {onPressEllipsis && (
        <>
          <Button onPress={onPressEllipsis}>
            <EllipsisIcon />
          </Button>
          <Spacer16 />
        </>
      )}
      {onPressClose && (
        <>
          <CloseButton onPress={onPressClose} />
          <Spacer16 />
        </>
      )}
    </Row>
    {fade && backgroundColor && <Fade backgroundColor={backgroundColor} />}
  </Wrapper>
);

export default TopBar;
