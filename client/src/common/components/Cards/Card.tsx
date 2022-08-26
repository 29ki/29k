import React from 'react';
import {View} from 'react-native';
import styled from 'styled-components/native';
import AnimatedLottieView from 'lottie-react-native';

import {COLORS} from '../../constants/colors';
import {SPACINGS} from '../../constants/spacings';
import Button from '../Buttons/Button';
import {Spacer16} from '../Spacers/Spacer';

import {H3} from '../Typography/Heading/Heading';
import {B2} from '../Typography/Text/Text';
// import HomeIcon from '../Icons/Home/Home';
// import {Spacer4, Spacer8} from '../Spacers/Spacer';

// Design
// Props
// Translation
// Library
// Temple page
// Image component

// Qs how to add attrs? ex activeOpacity={0.7}

const Lottie = styled(AnimatedLottieView)({
  aspectRatio: '1',
  overflow: 'hidden',
  alignSelf: 'flex-end',
  width: 130,
  height: 130,
});

const CardButton = styled(Button)({
  alignSelf: 'flex-start',
});
const Shadow = styled.View({
  shadowOffset: {
    width: 0,
    height: 5,
  },
  shadowOpacity: 0.29,
  shadowRadius: 6,
  elevation: 10,
  shadowColor: COLORS.BLACK,
});

const Wrapper = styled.TouchableOpacity({
  flex: 1,
  justifyContent: 'space-between',
  borderRadius: SPACINGS.TWENTYFOUR,
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
        {/* Add image component when not animation */}
        {graphic.animation && <Lottie source={graphic.src} autoPlay loop />}
      </Row>
    </Wrapper>
  </Shadow>
);

export default Card;
