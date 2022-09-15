import React from 'react';
import {ImageSourcePropType, View} from 'react-native';
import styled from 'styled-components/native';
import AnimatedLottieView, {AnimationObject} from 'lottie-react-native';

import {COLORS} from '../../constants/colors';
import {SPACINGS} from '../../constants/spacings';
import SETTINGS from '../../constants/settings';
import Button from '../Buttons/Button';
import {Spacer16} from '../Spacers/Spacer';
import {H3} from '../Typography/Heading/Heading';
import {B2} from '../Typography/Text/Text';
import Image from '../Image/Image';
import TouchableOpacity from '../TouchableOpacity/TouchableOpacity';

const GraphicsWrapper = styled.View({
  overflow: 'hidden',
  justifyContent: 'flex-end',
  width: 100,
  height: 100,
  marginRight: -16,
  marginBottom: -16,
});

const Lottie = styled(AnimatedLottieView)({
  aspectRatio: '1',
});

const CardButton = styled(Button)({
  alignSelf: 'flex-start',
});

const Wrapper = styled(TouchableOpacity)<{backgroundColor?: string}>(
  ({backgroundColor}) => ({
    justifyContent: 'space-between',
    borderRadius: SETTINGS.BORDER_RADIUS.CARDS,
    backgroundColor: backgroundColor || COLORS.YELLOW_LIGHT,
    padding: SPACINGS.SIXTEEN,
    ...SETTINGS.BOXSHADOW,
  }),
);

const Row = styled.View({
  flexDirection: 'row',
});

const CallToAction = styled.View({flex: 1, justifyContent: 'flex-end'});

type CardProps = {
  title?: string;
  description?: string;
  image?: ImageSourcePropType;
  lottie?: AnimationObject;
  onPress: () => void;
  buttonText: string;
  backgroundColor?: string;
};

export const Card: React.FC<CardProps> = ({
  title,
  description,
  lottie,
  image,
  onPress,
  buttonText,
  children,
  backgroundColor,
}) => (
  <Wrapper backgroundColor={backgroundColor} onPress={onPress}>
    <View>
      {title && <H3>{title}</H3>}
      {description && <B2 numberOfLines={1}>{description}</B2>}
    </View>
    <Spacer16 />
    <Row>
      <CallToAction>
        {children}
        <CardButton onPress={onPress}>{buttonText}</CardButton>
      </CallToAction>
      <GraphicsWrapper>
        {lottie ? (
          <Lottie source={lottie} autoPlay loop />
        ) : image ? (
          <Image source={image} />
        ) : null}
      </GraphicsWrapper>
    </Row>
  </Wrapper>
);

export default Card;
