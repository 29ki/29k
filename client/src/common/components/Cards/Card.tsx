import React from 'react';
import {ImageSourcePropType} from 'react-native';
import styled from 'styled-components/native';
import AnimatedLottieView, {AnimationObject} from 'lottie-react-native';

import {COLORS} from '../../../../../shared/src/constants/colors';
import {SPACINGS} from '../../constants/spacings';
import SETTINGS from '../../constants/settings';
import Button from '../Buttons/Button';
import Image from '../Image/Image';
import TouchableOpacity from '../TouchableOpacity/TouchableOpacity';
import {Display24} from '../Typography/Display/Display';
import IconButton from '../Buttons/IconButton/IconButton';
import {EllipsisIcon, IconType} from '../Icons';
import Byline from '../Bylines/Byline';
import {Spacer4, Spacer8} from '../Spacers/Spacer';

const GraphicsWrapper = styled.View({
  position: 'absolute',
  width: 132,
  height: 132,
  right: 0,
  bottom: 0,
});

const Lottie = styled(AnimatedLottieView)({
  aspectRatio: '1',
});

const Wrapper = styled(TouchableOpacity)({
  flexDirection: 'row',
  justifyContent: 'space-between',
  borderRadius: SETTINGS.BORDER_RADIUS.CARDS,
  backgroundColor: COLORS.CREAM,
  overflow: 'hidden',
  height: 188,
});
const LeftCol = styled.View({
  flex: 2,
  justifyContent: 'space-between',
  padding: SPACINGS.SIXTEEN,
  paddingTop: SPACINGS.EIGHT,
});
const RightCol = styled.View({
  flex: 1,
});

const Header = styled.View({
  flex: 1,
  textOverflow: 'ellipsis',
});

const CardContext = styled.View({
  paddingRight: SPACINGS.EIGHT,
  paddingTop: SPACINGS.EIGHT,
  flexDirection: 'row',
  justifyContent: 'flex-end',
});
const Footer = styled.View({
  flexDirection: 'row',
  alignItems: 'flex-end',
});

const IconWrapper = styled.View({
  width: SPACINGS.THIRTYSIX,
  height: SPACINGS.THIRTYSIX,
  padding: 3,
});

const CTAButton = styled(Button)({
  alignSelf: 'flex-start',
});

type CardProps = {
  title?: string;
  image?: ImageSourcePropType;
  lottie?: AnimationObject;
  onPress: () => void;
  onButtonPress?: () => void;
  buttonText?: string;
  children?: React.ReactNode;
  onContextPress?: () => void;
  ButtonIcon?: IconType;
  Icon?: IconType;
  hostPictureURL?: string;
  hostName?: string;
};

export const Card: React.FC<CardProps> = ({
  title,
  lottie,
  image,
  onPress,
  buttonText,
  onButtonPress,
  children,
  onContextPress,
  ButtonIcon,
  Icon,
  hostPictureURL,
  hostName,
}) => (
  <Wrapper onPress={onPress}>
    <LeftCol>
      <Header>
        {title && <Display24 numberOfLines={2}>{title}</Display24>}
        <Spacer4 />
        <Byline pictureURL={hostPictureURL} name={hostName} />
      </Header>
      <Footer>
        {buttonText && (
          <>
            <CTAButton
              LeftIcon={ButtonIcon}
              small
              variant="secondary"
              onPress={onButtonPress ? onButtonPress : onPress}>
              {buttonText}
            </CTAButton>
            <Spacer8 />
          </>
        )}
        {children}
      </Footer>
    </LeftCol>
    <RightCol>
      <CardContext>
        {Icon && (
          <IconWrapper>
            <Icon />
          </IconWrapper>
        )}
        {onContextPress && (
          <IconButton
            small
            noBackground
            variant="tertiary"
            Icon={EllipsisIcon}
            onPress={onContextPress}
          />
        )}
      </CardContext>
      <GraphicsWrapper>
        {lottie ? (
          <Lottie source={lottie} autoPlay loop />
        ) : image ? (
          <Image resizeMode="contain" source={image} />
        ) : null}
      </GraphicsWrapper>
    </RightCol>
  </Wrapper>
);

export default Card;
