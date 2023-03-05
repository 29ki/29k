import React from 'react';
import styled from 'styled-components/native';
import {COLORS} from '../../../../../shared/src/constants/colors';
import {TopSafeArea} from '../Spacers/Spacer';
import TopBar from '../TopBar/TopBar';

type BackgroundColorProp = {
  backgroundColor: string;
};

const Wrapper = styled.View<BackgroundColorProp>(({backgroundColor}) => ({
  flex: 1,
  backgroundColor,
}));

const FloatingTopBar = styled.View({
  position: 'absolute',
  left: 0,
  right: 0,
  top: 0,
  zIndex: 1,
});

type ScreenProps = {
  backgroundColor?: string;
  children: React.ReactNode;
  title?: string;
  onPressBack?: () => void;
  onPressClose?: () => void;
  onPressEllipsis?: () => void;
};

const Screen: React.FC<ScreenProps> = ({
  backgroundColor = COLORS.WHITE,
  children,
  title,
  onPressBack,
  onPressClose,
  onPressEllipsis,
}) => {
  return (
    <Wrapper backgroundColor={backgroundColor}>
      {children}
      {(title || onPressBack || onPressClose || onPressEllipsis) && (
        <FloatingTopBar>
          <TopSafeArea />
          <TopBar
            title={title}
            onPressBack={onPressBack}
            onPressClose={onPressClose}
            onPressEllipsis={onPressEllipsis}
          />
        </FloatingTopBar>
      )}
    </Wrapper>
  );
};

export default React.memo(Screen);
