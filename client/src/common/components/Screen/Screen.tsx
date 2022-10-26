import React from 'react';
import {ViewProps} from 'react-native';
import LinearGradient, {
  LinearGradientProps,
} from 'react-native-linear-gradient';
import {EdgeInsets, useSafeAreaInsets} from 'react-native-safe-area-context';
import styled from 'styled-components/native';
import {COLORS} from '../../../../../shared/src/constants/colors';
import {SPACINGS} from '../../constants/spacings';
import IconButton from '../Buttons/IconButton/IconButton';
import {ArrowLeftIcon} from '../Icons';

const Wrapper = styled.View<{backgroundColor?: string}>(
  ({backgroundColor}) => ({
    flex: 1,
    backgroundColor: backgroundColor ? backgroundColor : COLORS.WHITE,
  }),
);

type TopBarWrapperProps = ViewProps & {
  floating?: boolean;
  safeArea: EdgeInsets;
};

const TopBarWrapper = styled.View<TopBarWrapperProps>(
  ({floating, safeArea}) => ({
    zIndex: 100,
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: safeArea.top,
    height: safeArea.top + SPACINGS.FOURTYFOUR,
    width: '100%',
    justifyContent: 'space-between',
    position: floating ? 'absolute' : 'relative',
  }),
);

type OverlayProps = LinearGradientProps & {safeArea: EdgeInsets};

const Overlay = styled(LinearGradient)<OverlayProps>(({safeArea}) => ({
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  height: safeArea.top + SPACINGS.FOURTYFOUR,
}));

type ScreenProps = {
  backgroundColor?: string;
  textColor?: string;
  children: React.ReactNode;
  onPressBack?: () => void;
  floatingTopBar?: boolean;
  topBarOverlay?: boolean;
};

const Screen: React.FC<ScreenProps> = ({
  backgroundColor,
  textColor,
  children,
  onPressBack,
  floatingTopBar = true,
  topBarOverlay = false,
}) => {
  const safeArea = useSafeAreaInsets();

  return (
    <Wrapper backgroundColor={backgroundColor}>
      {onPressBack && (
        <TopBarWrapper floating={floatingTopBar} safeArea={safeArea}>
          {topBarOverlay && (
            <Overlay
              colors={[COLORS.WHITE, COLORS.WHITE_TRANSPARENT]}
              start={{x: 0, y: 0.8}}
              end={{x: 0, y: 1}}
              safeArea={safeArea}
            />
          )}
          <IconButton
            Icon={ArrowLeftIcon}
            onPress={onPressBack}
            noBackground
            fill={textColor}
            variant="tertiary"
          />
        </TopBarWrapper>
      )}
      {children}
    </Wrapper>
  );
};

export default Screen;
