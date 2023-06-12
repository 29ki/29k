import React, {useMemo} from 'react';
import {ImageSourcePropType} from 'react-native';
import styled from 'styled-components/native';
import LinearGradient from 'react-native-linear-gradient';

import {COLORS} from '../../../../../../shared/src/constants/colors';
import Image from '../../Image/Image';
import {Display16} from '../../Typography/Display/Display';
import {SPACINGS} from '../../../constants/spacings';
import TouchableOpacity from '../../TouchableOpacity/TouchableOpacity';
import {Spacer8} from '../../Spacers/Spacer';
import {PlayfairDisplayMedium} from '../../../constants/fonts';
import {prop} from 'ramda';

type CollectionCardProps = {
  title?: string;
  image: ImageSourcePropType;
  backgroundColorGradient?: {color: string}[];
  textColor?: string;
  onPress: () => void;
};

export const CARD_WIDTH = 208;

const Container = styled(TouchableOpacity)({
  height: CARD_WIDTH,
  width: CARD_WIDTH,
  backgroundColor: COLORS.GREYLIGHTEST,
  borderRadius: SPACINGS.SIXTEEN,
});

const ImageContainer = styled.View({
  justifyContent: 'center',
  flex: 1,
  paddingVertical: SPACINGS.EIGHT,
  paddingHorizontal: SPACINGS.SIXTEEN,
});

const GraphicsWrapper = styled.View({
  width: '100%',
  aspectRatio: 1,
});

const Heading = styled(Display16)<{color?: string}>(
  ({color = COLORS.BLACK}) => ({
    fontFamily: PlayfairDisplayMedium,
    lineHeight: 27,
    color,
  }),
);

const Gradient = styled(LinearGradient).attrs<{colors: string[]}>(
  ({colors}) => ({
    colors,
    angle: 180,
  }),
)({
  flex: 1,
  borderRadius: SPACINGS.SIXTEEN,
  paddingVertical: SPACINGS.FOUR,
  paddingHorizontal: SPACINGS.SIXTEEN,
});

const CollectionCard: React.FC<CollectionCardProps> = ({
  title,
  image,
  backgroundColorGradient,
  textColor,
  onPress,
}) => {
  const bgColors = useMemo(() => {
    const colors = backgroundColorGradient
      ? backgroundColorGradient.map(prop('color'))
      : [];

    while (colors.length < 2) {
      colors.push('transparent');
    }

    return colors;
  }, [backgroundColorGradient]);

  return (
    <Container onPress={onPress}>
      <Gradient colors={bgColors}>
        <Heading color={textColor}>{title}</Heading>
        <ImageContainer>
          <GraphicsWrapper>
            <Image source={image} />
          </GraphicsWrapper>
        </ImageContainer>
        <Spacer8 />
      </Gradient>
    </Container>
  );
};

export default React.memo(CollectionCard);
