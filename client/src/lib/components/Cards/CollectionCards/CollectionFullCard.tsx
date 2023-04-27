import React from 'react';
import {ImageSourcePropType} from 'react-native';
import styled from 'styled-components/native';

import {COLORS} from '../../../../../../shared/src/constants/colors';
import Image from '../../Image/Image';
import {Display20} from '../../Typography/Display/Display';
import {SPACINGS} from '../../../constants/spacings';
import TouchableOpacity from '../../TouchableOpacity/TouchableOpacity';
import {Spacer4, Spacer8} from '../../Spacers/Spacer';
import SessionProgress from '../../SessionProgress/SessionProgress';

type CollectionFullCardProps = {
  title: string | null;
  image: ImageSourcePropType;
  progressItems: Array<boolean>;
  onPress: () => void;
};

const Container = styled(TouchableOpacity)({
  height: 174,
  backgroundColor: COLORS.GREYLIGHTEST,
  paddingVertical: SPACINGS.FOUR,
  paddingHorizontal: SPACINGS.SIXTEEN,
});

const Row = styled.View({
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  flex: 1,
});

const LeftColumn = styled.View({
  flex: 1,
  height: 134,
  justifyContent: 'space-between',
  paddingVertical: SPACINGS.EIGHT,
});

const GraphicsWrapper = styled.View({
  width: 134,
  height: 134,
  paddingVertical: SPACINGS.EIGHT,
  paddingHorizontal: SPACINGS.SIXTEEN,
});

const CollectionFullCard: React.FC<CollectionFullCardProps> = ({
  title,
  image,
  progressItems,
  onPress,
}) => {
  return (
    <Container onPress={onPress}>
      <Row>
        <LeftColumn>
          <Spacer8 />
          <Display20 numberOfLines={3}>{title}</Display20>
          <Spacer8 />
        </LeftColumn>

        <GraphicsWrapper>
          <Image source={image} />
        </GraphicsWrapper>
      </Row>
      <SessionProgress items={progressItems} />
      <Spacer4 />
    </Container>
  );
};

export default React.memo(CollectionFullCard);
