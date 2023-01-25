import React from 'react';
import {ImageSourcePropType} from 'react-native';
import styled from 'styled-components/native';
import AnimatedLottieView, {AnimationObject} from 'lottie-react-native';

import {COLORS} from '../../../../../shared/src/constants/colors';
import {SPACINGS} from '../../constants/spacings';
import SETTINGS from '../../constants/settings';
import Image from '../Image/Image';
import {Display16} from '../Typography/Display/Display';
import TouchableOpacity from '../TouchableOpacity/TouchableOpacity';
import Byline from '../Bylines/Byline';

export const WALLET_CARD_HEIGHT = 80;

const GraphicsWrapper = styled.View({
  width: 64,
  height: 64,
  marginVertical: SPACINGS.EIGHT,
  marginHorizontal: SPACINGS.SIXTEEN,
});

const Lottie = styled(AnimatedLottieView)({
  aspectRatio: '1',
});

const Spacer2 = styled.View({height: 2});

const getShadow = (shadow?: boolean) => {
  if (shadow) {
    return {
      shadowColor: COLORS.BLACK,
      shadowOffset: `0 -${SPACINGS.EIGHT}px`,
      shadowRadius: 20,
      shadowOpacity: 0.1,
    };
  }
  return {};
};

const Wrapper = styled(TouchableOpacity)<{
  hasCardBefore: boolean;
  hasCardAfter: boolean;
}>(({hasCardBefore, hasCardAfter}) => ({
  justifyContent: 'space-between',
  borderRadius: SETTINGS.BORDER_RADIUS.CARDS,
  backgroundColor: COLORS.CREAM,
  marginTop: hasCardBefore ? -(WALLET_CARD_HEIGHT * 0.5) : undefined,
  height: hasCardAfter ? WALLET_CARD_HEIGHT * 1.5 : WALLET_CARD_HEIGHT,
  ...getShadow(hasCardBefore),
}));

const ContentWrapper = styled.View({
  flex: 1,
  flexDirection: 'row',
  justifyContent: 'space-between',
});

const LeftCol = styled.View({
  flex: 1,
  paddingHorizontal: SPACINGS.SIXTEEN,
  paddingVertical: SPACINGS.EIGHT,
});

type WalletCardProps = {
  title?: string;
  image?: ImageSourcePropType;
  lottie?: AnimationObject | {uri: string};
  hostPictureURL?: string;
  hostName?: string;
  onPress: () => void;
  children?: React.ReactNode;
  hasCardBefore: boolean;
  hasCardAfter: boolean;
};

export const WalletCard: React.FC<WalletCardProps> = ({
  title,
  lottie,
  image,
  hostPictureURL,
  hostName,
  onPress,
  hasCardBefore,
  hasCardAfter,
  children,
}) => (
  <Wrapper
    hasCardBefore={hasCardBefore}
    hasCardAfter={hasCardAfter}
    onPress={onPress}>
    <ContentWrapper>
      <LeftCol>
        {title && <Display16>{title}</Display16>}
        <Spacer2 />
        <Byline small pictureURL={hostPictureURL} name={hostName} />
        <Spacer2 />
        {children}
      </LeftCol>
      <GraphicsWrapper>
        {lottie ? (
          <Lottie source={lottie} autoPlay loop />
        ) : image ? (
          <Image resizeMode="contain" source={image} />
        ) : null}
      </GraphicsWrapper>
    </ContentWrapper>
  </Wrapper>
);

export default WalletCard;
