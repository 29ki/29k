import React, {useCallback, useMemo} from 'react';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {useNavigation} from '@react-navigation/native';

import {JourneyStackProps} from '../../../../lib/navigation/constants/routes';
import useCollectionById from '../../../../lib/content/hooks/useCollectionById';
import usePinnedCollectionById from '../../../../lib/user/hooks/usePinnedCollectionById';
import useCompletedSessionByTime from '../../../../lib/user/hooks/useCompletedSessionByTime';
import CollectionFullCard from '../../../../lib/components/Cards/CollectionCards/CollectionFullCard';
import useExercisesByCollectionId from '../../../../lib/content/hooks/useExercisesByCollectionId';

type CollectionCardContainer = {
  collectionId: string;
};

const CollectionCardContainer: React.FC<CollectionCardContainer> = ({
  collectionId,
}) => {
  const {navigate} =
    useNavigation<NativeStackNavigationProp<JourneyStackProps, 'Collection'>>();
  const collection = useCollectionById(collectionId);
  const savedCollection = usePinnedCollectionById(collectionId);
  const exercises = useExercisesByCollectionId(collectionId);
  const {getCompletedSessionByExerciseId} = useCompletedSessionByTime();

  const image = useMemo(
    () => ({
      uri: collection?.image?.source,
    }),
    [collection],
  );

  const items = useMemo(() => {
    if (exercises.length > 0 && savedCollection) {
      return exercises
        .map(e =>
          getCompletedSessionByExerciseId(e.id, savedCollection.startedAt)
            ? true
            : false,
        )
        .sort(a => (a ? -1 : 1));
    } else if (collection) {
      return exercises.map(() => false);
    }
    return [];
  }, [collection, savedCollection, exercises, getCompletedSessionByExerciseId]);

  const onPress = useCallback(() => {
    navigate('Collection', {collectionId: collection?.id});
  }, [navigate, collection]);

  if (!collection) {
    return null;
  }

  return (
    <CollectionFullCard
      title={collection.name}
      image={image}
      progressItems={items}
      onPress={onPress}
    />
  );
};

export default CollectionCardContainer;
