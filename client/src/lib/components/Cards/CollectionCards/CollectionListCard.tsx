import React from 'react';
import {ImageSourcePropType} from 'react-native';
import styled from 'styled-components/native';

import {COLORS} from '../../../../../../shared/src/constants/colors';
import Image from '../../Image/Image';
import {Display16} from '../../Typography/Display/Display';
import {SPACINGS} from '../../../constants/spacings';
import TouchableOpacity from '../../TouchableOpacity/TouchableOpacity';
import {Spacer8} from '../../Spacers/Spacer';

type CollectionCardProps = {
  title: string | null;
  image: ImageSourcePropType;
  onPress: () => void;
};

export const CARD_WIDTH = 208;

const Container = styled(TouchableOpacity)({
  height: CARD_WIDTH,
  width: CARD_WIDTH,
  backgroundColor: COLORS.GREYLIGHTEST,
  paddingVertical: SPACINGS.FOUR,
  paddingHorizontal: SPACINGS.SIXTEEN,
});

const ImageContainer = styled.View({
  flexDirection: 'row',
  justifyContent: 'center',
  alignItems: 'center',
  flex: 1,
});

const GraphicsWrapper = styled.View({
  width: '100%',
  height: '100%',
  paddingVertical: SPACINGS.EIGHT,
  paddingHorizontal: SPACINGS.SIXTEEN,
});

const CollectionCard: React.FC<CollectionCardProps> = ({
  title,
  image,
  onPress,
}) => {
  return (
    <Container onPress={onPress}>
      <Display16>{title}</Display16>
      <ImageContainer>
        <GraphicsWrapper>
          <Image source={image} />
        </GraphicsWrapper>
      </ImageContainer>
      <Spacer8 />
    </Container>
  );
};

export default React.memo(CollectionCard);
