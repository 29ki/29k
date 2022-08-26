import React from 'react';
import {View} from 'react-native';
import styled from 'styled-components/native';
import AnimatedLottieView from 'lottie-react-native';

import {COLORS} from '../../constants/colors';
import {SPACINGS} from '../../constants/spacings';
import SETTINGS from '../../constants/settings';
import Button from '../Buttons/Button';
import {Spacer16} from '../Spacers/Spacer';
import {H3} from '../Typography/Heading/Heading';
import {B2} from '../Typography/Text/Text';

const GraphicsWrapper = styled.View({
  overflow: 'hidden',
  alignSelf: 'flex-end',
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

const Shadow = styled.View({
  ...SETTINGS.BOXSHADOW,
  shadowColor: COLORS.BLACK,
});

const Wrapper = styled.TouchableOpacity({
  flex: 1,
  justifyContent: 'space-between',
  borderRadius: SETTINGS.BORDER_RADIUS.CARDS,
  backgroundColor: COLORS.YELLOW_LIGHT,
  padding: SPACINGS.SIXTEEN,
});

const Row = styled.View({
  flexDirection: 'row',
});

const CallToAction = styled.View({flex: 1, justifyContent: 'flex-end'});

type Graphics = {
  src: string;
  alt?: string;
  animation: boolean;
};

type CardProps = {
  title: string;
  description?: string;
  graphic: Graphics;
  onPress: () => void;
  buttonText: string;
};

export const Card: React.FC<CardProps> = ({
  title,
  description,
  graphic = {src: '', animation: false},
  onPress,
  buttonText,
  children,
}) => (
  <Shadow>
    <Wrapper onPress={onPress}>
      <View>
        {Boolean(title) && <H3>{title}</H3>}
        {Boolean(description) && <B2 numberOfLines={1}>{description}</B2>}
      </View>
      <Spacer16 />
      <Row>
        <CallToAction>
          {children}
          <CardButton onPress={onPress}>{buttonText}</CardButton>
        </CallToAction>
        <GraphicsWrapper>
          {/* Add image component when not animation */}
          {graphic.animation && <Lottie source={graphic.src} autoPlay loop />}
        </GraphicsWrapper>
      </Row>
    </Wrapper>
  </Shadow>
);

export default Card;
