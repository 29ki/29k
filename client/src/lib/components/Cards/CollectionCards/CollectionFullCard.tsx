import React, {useCallback, useMemo, useState} from 'react';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {useNavigation} from '@react-navigation/native';
import styled from 'styled-components/native';

import {JourneyStackProps} from '../../../navigation/constants/routes';
import {COLORS} from '../../../../../../shared/src/constants/colors';
import Image from '../../Image/Image';
import {Display20} from '../../Typography/Display/Display';
import {SPACINGS} from '../../../constants/spacings';
import TouchableOpacity from '../../TouchableOpacity/TouchableOpacity';
import CompletedSessionsCount from '../../CompletedSessionsCount/CompletedSessionsCount';
import {Spacer4, Spacer8} from '../../Spacers/Spacer';
import useCollectionById from '../../../content/hooks/useCollectionById';
import SessionProgress from '../../SessionProgress/SessionProgress';
import useCompletedSessionByTime from '../../../user/hooks/useCompletedSessionByTime';
import useSavedCollectionById from '../../../user/hooks/useSavedCollection';

type CollectionFullCardProps = {
  collectionId: string;
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
});

const GraphicsWrapper = styled.View({
  width: 134,
  height: 134,
  paddingVertical: SPACINGS.EIGHT,
  paddingHorizontal: SPACINGS.SIXTEEN,
});

const CollectionFullCard: React.FC<CollectionFullCardProps> = ({
  collectionId,
}) => {
  const {navigate} =
    useNavigation<NativeStackNavigationProp<JourneyStackProps, 'Collection'>>();
  const collection = useCollectionById(collectionId);
  const savedCollection = useSavedCollectionById(collectionId);
  const {getCompletedSessionByExerciseId} = useCompletedSessionByTime();
  const [completedSessionCount] = useState(0); // TODO: get this from some storage

  const image = useMemo(
    () => ({
      uri: collection?.image?.source,
    }),
    [collection],
  );

  const items = useMemo(() => {
    if (collection && savedCollection) {
      return collection.exercises
        .map(id =>
          getCompletedSessionByExerciseId(id, savedCollection.statedAt)
            ? true
            : false,
        )
        .sort(a => (a ? -1 : 1));
    } else if (collection) {
      return collection.exercises.map(() => false);
    }
    return [];
  }, [collection, savedCollection, getCompletedSessionByExerciseId]);

  const onPress = useCallback(() => {
    navigate('Collection', {collectionId: collection?.id});
  }, [navigate, collection]);

  if (!collection) {
    return null;
  }

  return (
    <Container onPress={onPress}>
      <Row>
        <LeftColumn>
          <Spacer8 />
          <Display20 numberOfLines={3}>{collection?.name}</Display20>
          {completedSessionCount > 0 ? (
            <CompletedSessionsCount count={completedSessionCount} />
          ) : (
            <Spacer8 />
          )}
        </LeftColumn>

        <GraphicsWrapper>
          <Image source={image} />
        </GraphicsWrapper>
      </Row>
      <SessionProgress items={items} />
      <Spacer4 />
    </Container>
  );
};

export default CollectionFullCard;
