import React, {useCallback, useMemo} from 'react';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {useNavigation} from '@react-navigation/native';

import {Collection} from '../../../../../../shared/src/types/generated/Collection';
import CollectionListCard from '../../../../lib/components/Cards/CollectionCards/CollectionListCard';
import {ExploreStackProps} from '../../../../lib/navigation/constants/routes';

export {CARD_WIDTH} from '../../../../lib/components/Cards/CollectionCards/CollectionListCard';

type CollectionCardProps = {
  collection: Collection;
};

const CollectionCardContainer: React.FC<CollectionCardProps> = ({
  collection,
}) => {
  const {navigate} =
    useNavigation<NativeStackNavigationProp<ExploreStackProps, 'Collection'>>();

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
    <CollectionListCard
      onPress={onPress}
      image={image}
      title={collection.name}
    />
  );
};

export default React.memo(CollectionCardContainer);
