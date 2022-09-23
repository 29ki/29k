import React from 'react';
import {ImageSourcePropType, View} from 'react-native';
import styled from 'styled-components/native';
import AnimatedLottieView, {AnimationObject} from 'lottie-react-native';

import {COLORS} from '../../constants/colors';
import {SPACINGS} from '../../constants/spacings';
import SETTINGS from '../../constants/settings';
import Button from '../Buttons/Button';
import {Spacer16} from '../Spacers/Spacer';
import {B16} from '../Typography/Text/Text';
import Image from '../Image/Image';
import TouchableOpacity from '../TouchableOpacity/TouchableOpacity';
import {Display24} from '../Typography/Display/Display';

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

const Wrapper = styled(TouchableOpacity)({
  justifyContent: 'space-between',
  borderRadius: SETTINGS.BORDER_RADIUS.CARDS,
  backgroundColor: COLORS.CREAM,
  padding: SPACINGS.SIXTEEN,
});

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
  children?: React.ReactNode;
};

export const Card: React.FC<CardProps> = ({
  title,
  description,
  lottie,
  image,
  onPress,
  buttonText,
  children,
}) => (
  <Wrapper onPress={onPress}>
    <View>
      {title && <Display24>{title}</Display24>}
      {description && <B16 numberOfLines={1}>{description}</B16>}
    </View>
    <Spacer16 />
    <Row>
      <CallToAction>
        {children}
        <CardButton small variant="secondary" onPress={onPress}>
          {buttonText}
        </CardButton>
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
