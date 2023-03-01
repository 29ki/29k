import React, {useCallback, useMemo, useState} from 'react';
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
import CompletedSessionsCount from '../../CompletedSessionsCount/CompletedSessionsCount';

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
  const [completedSessionCount] = useState(0); // TODO: get this from some storage

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
      <Display16>{collection.name}</Display16>

      <ImageContainer>
        <GraphicsWrapper>
          <Image source={image} />
        </GraphicsWrapper>
      </ImageContainer>

      {completedSessionCount > 0 && (
        <CompletedSessionsCount count={completedSessionCount} />
      )}
    </Container>
  );
};

export default CollectionCard;
