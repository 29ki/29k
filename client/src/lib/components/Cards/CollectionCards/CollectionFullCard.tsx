import React from 'react';
import {ImageSourcePropType} from 'react-native';
import styled from 'styled-components/native';

import {COLORS} from '../../../../../../shared/src/constants/colors';
import Image from '../../Image/Image';
import {Display22} from '../../Typography/Display/Display';
import {SPACINGS} from '../../../constants/spacings';
import TouchableOpacity from '../../TouchableOpacity/TouchableOpacity';
import {Spacer16, Spacer4, Spacer8} from '../../Spacers/Spacer';
import SessionProgress from '../../SessionProgress/SessionProgress';
import {CollectionIcon} from '../../Icons';
import {Body12} from '../../Typography/Body/Body';

export const HEIGHT = 114;

type CollectionFullCardProps = {
  title: string;
  description?: string;
  image: ImageSourcePropType;
  progressItems: Array<boolean>;
  onPress: () => void;
};

const Container = styled(TouchableOpacity)({
  height: HEIGHT,
  backgroundColor: COLORS.GREYLIGHTEST,
  paddingVertical: SPACINGS.FOUR,
  paddingHorizontal: SPACINGS.SIXTEEN,
  borderRadius: SPACINGS.SIXTEEN,
});

const IconWrapper = styled.View({
  width: 30,
  height: 30,
  alignItems: 'center',
  justifyContent: 'center',
});

const Row = styled.View({
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  flex: 1,
});

const LeftColumn = styled.View({
  flex: 1,
  height: 86,
  paddingVertical: SPACINGS.EIGHT,
});

const TitleWrapper = styled.View({
  flexDirection: 'row',
  alignItems: 'center',
});

const GraphicsWrapper = styled.View({
  width: 64,
  height: 64,
});

const CollectionFullCard: React.FC<CollectionFullCardProps> = ({
  title,
  image,
  description,
  progressItems,
  onPress,
}) => (
  <Container onPress={onPress}>
    <Row>
      <LeftColumn>
        <TitleWrapper>
          <IconWrapper>
            <CollectionIcon />
          </IconWrapper>
          <Spacer8 />
          <Display22 numberOfLines={3}>{title}</Display22>
        </TitleWrapper>
        <Spacer8 />
        <Body12 numberOfLines={2}>{description}</Body12>
      </LeftColumn>
      <Spacer16 />
      <GraphicsWrapper>
        <Image source={image} />
      </GraphicsWrapper>
    </Row>
    <SessionProgress items={progressItems} />
    <Spacer4 />
  </Container>
);

export default React.memo(CollectionFullCard);
