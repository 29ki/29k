import React from 'react';
import styled from 'styled-components/native';
import {COLORS} from '../../../../../shared/src/constants/colors';
import {SPACINGS} from '../../constants/spacings';
import IconButton from '../Buttons/IconButton/IconButton';
import {ArrowLeftIcon} from '../Icons';
import {TopSafeArea} from '../Spacers/Spacer';

const Wrapper = styled.View<{backgroundColor?: string}>(
  ({backgroundColor}) => ({
    flex: 1,
    backgroundColor: backgroundColor ? backgroundColor : COLORS.WHITE,
  }),
);

const TopBarWrapper = styled.View({
  zIndex: 100,
  flexDirection: 'row',
  alignItems: 'center',
  paddingLeft: 16,
  paddingRight: 16,
  height: 48,
  width: '100%',
  justifyContent: 'space-between',
});

const BackButton = styled(IconButton)({
  marginLeft: -SPACINGS.SIXTEEN,
});

const TopBar: React.FC<{
  hasDarkBackground?: boolean;
  onPressBack?: () => void;
}> = ({onPressBack, hasDarkBackground: isOnDarkBackground}) => (
  <>
    <TopSafeArea />
    <TopBarWrapper>
      {Boolean(onPressBack) && (
        <BackButton
          noBackground
          onPress={onPressBack}
          Icon={ArrowLeftIcon}
          fill={isOnDarkBackground ? COLORS.WHITE : COLORS.BLACK}
        />
      )}
    </TopBarWrapper>
  </>
);

type ScreenProps = {
  backgroundColor?: string;
  children: React.ReactNode;
  hasDarkBackground?: boolean;
  noStatusBar?: boolean;
  noTopBar?: boolean;
  onPressBack?: () => void;
  title?: string;
};

const Screen: React.FC<ScreenProps> = ({
  backgroundColor,
  children,
  hasDarkBackground,
  noTopBar,
  onPressBack,
}) => {
  return (
    <Wrapper backgroundColor={backgroundColor}>
      {!noTopBar && (
        <TopBar
          onPressBack={onPressBack}
          hasDarkBackground={hasDarkBackground}
        />
      )}
      {children}
    </Wrapper>
  );
};

export default Screen;
