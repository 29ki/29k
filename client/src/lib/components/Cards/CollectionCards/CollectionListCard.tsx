import React, {useCallback, useMemo} from 'react';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {useNavigation} from '@react-navigation/native';
import styled from 'styled-components/native';

import {SessionsStackProps} from '../../../navigation/constants/routes';
import {COLORS} from '../../../../../../shared/src/constants/colors';
import {Collection} from '../../../../../../shared/src/types/generated/Collection';
import Image from '../../Image/Image';
import {Display16} from '../../Typography/Display/Display';
import {SPACINGS} from '../../../constants/spacings';
import TouchableOpacity from '../../TouchableOpacity/TouchableOpacity';
import {Spacer8} from '../../Spacers/Spacer';

type CollectionCardProps = {
  collection: Collection;
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

const CollectionCard: React.FC<CollectionCardProps> = ({collection}) => {
  const {navigate} =
    useNavigation<
      NativeStackNavigationProp<SessionsStackProps, 'Collection'>
    >();

  const image = useMemo(
    () => ({
      uri: collection?.image?.source,
    }),
    [collection],
  );

  const onPress = useCallback(() => {
    navigate('Collection', {collectionId: collection.id});
  }, [navigate, collection]);

  return (
    <Container onPress={onPress}>
      <Display16>{collection.name + 'sdfsdfsdf dsfdsfsdf'}</Display16>

      <ImageContainer>
        <GraphicsWrapper>
          <Image source={image} />
        </GraphicsWrapper>
      </ImageContainer>
      <Spacer8 />
    </Container>
  );
};

export default CollectionCard;
