import React, {Fragment} from 'react';
import {ImageSourcePropType} from 'react-native';
import styled from 'styled-components/native';
import AnimatedLottieView, {AnimationObject} from 'lottie-react-native';

import {COLORS} from '../../../../../shared/src/constants/colors';
import {SPACINGS} from '../../constants/spacings';
import SETTINGS from '../../constants/settings';
import Image from '../Image/Image';
import TouchableOpacity from '../TouchableOpacity/TouchableOpacity';
import {Display20} from '../Typography/Display/Display';
import Byline from '../Bylines/Byline';
import {Spacer4} from '../Spacers/Spacer';
import Gutters from '../Gutters/Gutters';
import Tag from '../Tag/Tag';
import {WALLET_CARD_HEIGHT} from './WalletCards/SessionWalletCard';

export const CARD_HEIGHT = 184;

const GraphicsWrapper = styled.View({
  width: 120,
  height: 120,
});

const Lottie = styled(AnimatedLottieView)({
  aspectRatio: '1',
});

const WalletWrapper = styled.View<{inWallet?: boolean}>(({inWallet}) => ({
  justifyContent: 'space-between',
  backgroundColor: COLORS.CREAM,
  borderRadius: SETTINGS.BORDER_RADIUS.CARDS,
  height: inWallet ? CARD_HEIGHT + WALLET_CARD_HEIGHT * 0.5 : CARD_HEIGHT,
}));

const Wrapper = styled(TouchableOpacity)({
  justifyContent: 'space-between',
  borderRadius: SETTINGS.BORDER_RADIUS.CARDS,
  backgroundColor: COLORS.CREAM,
  height: CARD_HEIGHT,
});

const ContentWrapper = styled.View({
  flexDirection: 'row',
  justifyContent: 'space-between',
});

const LeftCol = styled.View({
  flex: 2,
  justifyContent: 'space-between',
  padding: SPACINGS.SIXTEEN,
});

const Tags = styled.View({
  flexWrap: 'wrap',
  flexDirection: 'row',
  alignItems: 'center',
  marginTop: -SPACINGS.FOUR,
});

const Header = styled.View({
  flex: 1,
  textOverflow: 'ellipsis',
});

const Footer = styled(Gutters)({
  justifyContent: 'space-between',
  alignItems: 'flex-end',
  flexDirection: 'row',
  flex: 1,
  paddingBottom: SPACINGS.SIXTEEN,
});

type CardProps = {
  title?: string;
  tags?: Array<string>;
  image?: ImageSourcePropType;
  lottie?: AnimationObject | {uri: string};
  onPress: () => void;
  children?: React.ReactNode;
  hostPictureURL?: string;
  hostName?: string;
  inWallet?: boolean;
};

export const Card: React.FC<CardProps> = ({
  title,
  tags,
  lottie,
  image,
  onPress,
  children,
  hostPictureURL,
  hostName,
  inWallet,
}) => (
  <WalletWrapper inWallet={inWallet}>
    <Wrapper onPress={onPress}>
      <ContentWrapper>
        <LeftCol>
          {tags && (
            <Tags>
              {tags.map(tag => (
                <Fragment key={tag}>
                  <Tag>{tag}</Tag>
                  <Spacer4 />
                </Fragment>
              ))}
            </Tags>
          )}
          <Header>
            {title && <Display20 numberOfLines={2}>{title}</Display20>}
            <Spacer4 />
            <Byline pictureURL={hostPictureURL} name={hostName} />
          </Header>
        </LeftCol>
        <GraphicsWrapper>
          {lottie ? (
            <Lottie source={lottie} autoPlay loop />
          ) : image ? (
            <Image resizeMode="contain" source={image} />
          ) : null}
        </GraphicsWrapper>
      </ContentWrapper>
      <Footer>{children}</Footer>
    </Wrapper>
  </WalletWrapper>
);

export default Card;
