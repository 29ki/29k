import React, {Fragment, useMemo} from 'react';
import {ImageSourcePropType, ViewStyle} from 'react-native';
import styled from 'styled-components/native';
import AnimatedLottieView, {AnimationObject} from 'lottie-react-native';
import LinearGradient from 'react-native-linear-gradient';
import hexToRgba from 'hex-to-rgba';

import {COLORS} from '../../../../../shared/src/constants/colors';
import {SPACINGS} from '../../constants/spacings';
import SETTINGS from '../../constants/settings';
import Image from '../Image/Image';
import TouchableOpacity from '../TouchableOpacity/TouchableOpacity';
import {Display20} from '../Typography/Display/Display';
import Byline from '../Bylines/Byline';
import {Spacer16, Spacer4} from '../Spacers/Spacer';
import Gutters from '../Gutters/Gutters';
import Tag from '../Tag/Tag';
import {HEIGHT as WALLET_CARD_HEIGHT} from './WalletCards/SessionWalletCard';
import {BellFillIcon, CheckIcon} from '../Icons';
import {useTranslation} from 'react-i18next';

export const HEIGHT = 184;

const GraphicsWrapper = styled.View({
  width: 140,
  height: 140,
  paddingBottom: SPACINGS.SIXTEEN,
});

const Lottie = styled(AnimatedLottieView)({
  aspectRatio: '1',
});

const WalletWrapper = styled.View<{inWallet?: boolean}>(({inWallet}) => ({
  justifyContent: 'space-between',
  backgroundColor: COLORS.CREAM,
  borderRadius: SETTINGS.BORDER_RADIUS.CARDS,
  height: inWallet ? HEIGHT + WALLET_CARD_HEIGHT * 0.5 : HEIGHT,
}));

const Wrapper = styled(TouchableOpacity)({
  justifyContent: 'space-between',
  borderRadius: SETTINGS.BORDER_RADIUS.CARDS,
  backgroundColor: COLORS.CREAM,
  height: HEIGHT,
});

const ContentWrapper = styled.View({
  flexDirection: 'row',
});

const LeftCol = styled.View({
  flex: 2,
  justifyContent: 'space-between',
  paddingHorizontal: SPACINGS.SIXTEEN,
});

const Tags = styled.View({
  flexDirection: 'row',
  alignItems: 'center',
});

const PinnedTag = styled(Tag)({
  backgroundColor: COLORS.PRIMARY,
  color: COLORS.WHITE,
});

const TagsGradient = styled(LinearGradient)({
  position: 'absolute',
  right: -SPACINGS.SIXTEEN,
  bottom: 0,
  width: 30,
  height: 20,
});

const Header = styled.View({
  flex: 1,
  textOverflow: 'ellipsis',
});

const Footer = styled.View({
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
  onHostPress?: () => void;
  children?: React.ReactNode;
  hostPictureURL?: string;
  hostName?: string;
  inWallet?: boolean;
  isPinned?: boolean;
  reminderEnabled?: boolean;
  style?: ViewStyle;
};

export const Card: React.FC<CardProps> = ({
  title,
  tags,
  lottie,
  image,
  onPress,
  onHostPress,
  children,
  hostPictureURL,
  hostName,
  inWallet,
  isPinned,
  reminderEnabled,
  style,
}) => {
  const {t} = useTranslation('Component.Card');
  const colors = useMemo(
    () => [
      hexToRgba(COLORS.CREAM, 0),
      hexToRgba(COLORS.CREAM, 1),
      hexToRgba(COLORS.CREAM, 1),
    ],
    [],
  );
  return (
    <WalletWrapper inWallet={inWallet} style={style}>
      <Wrapper onPress={onPress}>
        {tags && (
          <Gutters>
            <Spacer16 />
            <Tags>
              {isPinned && (
                <>
                  <PinnedTag
                    LeftIcon={reminderEnabled ? BellFillIcon : CheckIcon}
                    iconFill={COLORS.WHITE}>
                    {t('myJourneyTag')}
                  </PinnedTag>
                  <Spacer4 />
                </>
              )}
              {tags.map(tag => (
                <Fragment key={tag}>
                  <Tag>{tag}</Tag>
                  <Spacer4 />
                </Fragment>
              ))}
              <TagsGradient
                start={{x: 0, y: 0}}
                end={{x: 1, y: 0}}
                colors={colors}
              />
            </Tags>
            <Spacer4 />
          </Gutters>
        )}
        <ContentWrapper>
          <LeftCol>
            <Header>
              {title && <Display20 numberOfLines={2}>{title}</Display20>}
              <Spacer4 />
              {onHostPress ? (
                <TouchableOpacity onPress={onHostPress}>
                  <Byline pictureURL={hostPictureURL} name={hostName} />
                </TouchableOpacity>
              ) : (
                <Byline pictureURL={hostPictureURL} name={hostName} />
              )}
            </Header>
            <Footer>{children}</Footer>
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
    </WalletWrapper>
  );
};

export default Card;
