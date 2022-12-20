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
import {IconType} from '../Icons';
import Byline from '../Bylines/Byline';
import {Spacer4, Spacer8} from '../Spacers/Spacer';
import Gutters from '../Gutters/Gutters';
import Interested from '../Interested/Interested';

const GraphicsWrapper = styled.View({
  width: 120,
  height: 120,
});

const Lottie = styled(AnimatedLottieView)({
  aspectRatio: '1',
});

const Wrapper = styled(TouchableOpacity)({
  justifyContent: 'space-between',
  borderRadius: SETTINGS.BORDER_RADIUS.CARDS,
  backgroundColor: COLORS.CREAM,
  height: 174,
});

const ContentWrapper = styled.View({
  flexDirection: 'row',
  justifyContent: 'space-between',
});

const LeftCol = styled.View({
  flex: 2,
  justifyContent: 'space-between',
  padding: SPACINGS.SIXTEEN,
  paddingTop: SPACINGS.EIGHT,
});

const Header = styled.View({
  flex: 1,
  textOverflow: 'ellipsis',
});

const Footer = styled(Gutters)({
  flexDirection: 'row',
  paddingBottom: SPACINGS.SIXTEEN,
});

const LeftFooter = styled.View({});

const RightFooter = styled.View({
  justifyContent: 'space-between',
  flexDirection: 'row',
  flex: 1,
});

const CTAButton = styled(Button)({
  alignSelf: 'flex-start',
  marginRight: SPACINGS.SIXTEEN,
});

type CardProps = {
  title?: string;
  duration?: string;
  image?: ImageSourcePropType;
  lottie?: AnimationObject;
  onPress: () => void;
  onButtonPress?: () => void;
  buttonText?: string;
  children?: React.ReactNode;
  ButtonIcon?: IconType;
  hostPictureURL?: string;
  hostName?: string;
  pinned: boolean;
};

export const Card: React.FC<CardProps> = ({
  title,
  duration,
  lottie,
  image,
  onPress,
  buttonText,
  onButtonPress,
  children,
  ButtonIcon,
  hostPictureURL,
  hostName,
  pinned,
}) => (
  <>
    <Wrapper onPress={onPress}>
      <ContentWrapper>
        <LeftCol>
          <Header>
            {title && <Display24 numberOfLines={2}>{title}</Display24>}
            <Spacer4 />
            <Byline
              pictureURL={hostPictureURL}
              name={hostName}
              duration={duration}
            />
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
      <Footer>
        <LeftFooter>
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
        </LeftFooter>
        <RightFooter>
          {children}
          <Interested active={pinned} />
        </RightFooter>
      </Footer>
    </Wrapper>
  </>
);

export default Card;
