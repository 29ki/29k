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
import {Display20} from '../Typography/Display/Display';
import {IconType} from '../Icons';
import Byline from '../Bylines/Byline';
import {Spacer4} from '../Spacers/Spacer';
import Gutters from '../Gutters/Gutters';
import Interested from '../Interested/Interested';
import Tag from '../Tag/Tag';

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
  height: 184,
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
  flexDirection: 'row',
  paddingBottom: SPACINGS.SIXTEEN,
});

const LeftFooter = styled.View({});

const RightFooter = styled.View({
  alignItems: 'flex-end',
  flexDirection: 'row',
  flex: 1,
});

const RightFooterWrapper = styled.View({
  justifyContent: 'space-between',
  flexDirection: 'row',
  flex: 1,
});

const CTAButton = styled(Button)({
  alignSelf: 'flex-start',
  marginRight: SPACINGS.EIGHT,
});

type CardProps = {
  title?: string;
  tags: Array<string>;
  image?: ImageSourcePropType;
  lottie?: AnimationObject;
  onPress: () => void;
  onButtonPress?: () => void;
  onPinnedPress?: () => void;
  buttonText?: string;
  children?: React.ReactNode;
  ButtonIcon?: IconType;
  hostPictureURL?: string;
  hostName?: string;
  pinned: boolean;
};

export const Card: React.FC<CardProps> = ({
  title,
  tags,
  lottie,
  image,
  onPress,
  buttonText,
  onButtonPress,
  onPinnedPress,
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
          <Tags>
            {tags.map(tag => (
              <>
                <Tag>{tag}</Tag>
                <Spacer4 />
              </>
            ))}
          </Tags>
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
            </>
          )}
        </LeftFooter>
        <RightFooter>
          <RightFooterWrapper>
            {children}
            <Interested active={pinned} onPress={onPinnedPress} />
          </RightFooterWrapper>
        </RightFooter>
      </Footer>
    </Wrapper>
  </>
);

export default Card;
