import React from 'react';
import {ImageSourcePropType, View} from 'react-native';
import styled from 'styled-components/native';
import AnimatedLottieView, {AnimationObject} from 'lottie-react-native';

import {COLORS} from '../../../../../shared/src/constants/colors';
import {SPACINGS} from '../../constants/spacings';
import SETTINGS from '../../constants/settings';
import Button from '../Buttons/Button';
import {Body16} from '../Typography/Body/Body';
import Image from '../Image/Image';
import TouchableOpacity from '../TouchableOpacity/TouchableOpacity';
import {Display24} from '../Typography/Display/Display';
import IconButton from '../Buttons/IconButton/IconButton';
import {EllipsisIcon, IconType} from '../Icons';

const GraphicsWrapper = styled.View({
  position: 'absolute',
  width: 132,
  height: 132,
  right: -SPACINGS.SIXTEEN,
  bottom: -SPACINGS.SIXTEEN,
});

const Lottie = styled(AnimatedLottieView)({
  aspectRatio: '1',
});

const Wrapper = styled(TouchableOpacity)({
  justifyContent: 'space-between',
  borderRadius: SETTINGS.BORDER_RADIUS.CARDS,
  backgroundColor: COLORS.CREAM,
  padding: SPACINGS.SIXTEEN,
  paddingTop: SPACINGS.EIGHT,
  height: 188,
});

const HeaderRow = styled.View({
  flexDirection: 'row',
});

const Header = styled.View({
  flex: 1,
  textOverflow: 'ellipsis',
});

const Row = styled.View({
  flexDirection: 'row',
  justifyContent: 'space-between',
});

const IconWrapper = styled.View({
  width: 36,
  height: 36,
  padding: 3,
});

const CallToAction = styled.View({
  flex: 1,
  justifyContent: 'flex-end',
  alignItems: 'flex-start',
});

type CardProps = {
  title?: string;
  description?: string;
  image?: ImageSourcePropType;
  lottie?: AnimationObject;
  onPress: () => void;
  buttonText?: string;
  children?: React.ReactNode;
  onContextPress?: () => void;
  ButtonIcon?: IconType;
  Icon?: IconType;
};

export const Card: React.FC<CardProps> = ({
  title,
  description,
  lottie,
  image,
  onPress,
  buttonText,
  children,
  onContextPress,
  ButtonIcon,
  Icon,
}) => (
  <Wrapper onPress={onPress}>
    <View>
      <HeaderRow>
        <Header>
          {title && <Display24 numberOfLines={2}>{title}</Display24>}
          {description && <Body16 numberOfLines={1}>{description}</Body16>}
        </Header>
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
      </HeaderRow>
    </View>
    {children}
    <Row>
      <CallToAction>
        {buttonText && (
          <Button
            LeftIcon={ButtonIcon}
            small
            variant="secondary"
            onPress={onPress}>
            {buttonText}
          </Button>
        )}
      </CallToAction>
      <GraphicsWrapper>
        {lottie ? (
          <Lottie source={lottie} autoPlay loop />
        ) : image ? (
          <Image resizeMode="contain" source={image} />
        ) : null}
      </GraphicsWrapper>
    </Row>
  </Wrapper>
);

export default Card;
