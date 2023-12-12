import React from 'react';
import {Dimensions, FlatList, ListRenderItem} from 'react-native';
import styled from 'styled-components/native';
import {Spacer16} from '../../../../lib/components/Spacers/Spacer';
import {SPACINGS} from '../../../../lib/constants/spacings';
import Collection from './Collection';
import {Column, Columns} from './Columns';
import {Collection as CollectionType} from '../../../../../../shared/src/types/generated/Collection';

const SCREEN_DIMENSIONS = Dimensions.get('screen');
const CARD_WIDTH =
  (SCREEN_DIMENSIONS.width - SPACINGS.SIXTEEN) / 2 - SPACINGS.SIXTEEN * 2;

const CollectionWrapper = styled.View({
  width: CARD_WIDTH,
});

const renderCollection: ListRenderItem<CollectionType> = ({item}) => (
  <CollectionWrapper>
    <Collection collection={item} />
  </CollectionWrapper>
);

type Props = {
  collections: CollectionType[];
};
const Collections: React.FC<Props> = ({collections}) =>
  collections.length <= 2 ? (
    <Columns>
      {collections.map(collection => (
        <Column key={collection.id}>
          <Collection collection={collection} />
        </Column>
      ))}
    </Columns>
  ) : (
    <FlatList
      renderItem={renderCollection}
      horizontal
      data={collections}
      ListFooterComponent={Spacer16}
      ListHeaderComponent={Spacer16}
      ItemSeparatorComponent={Spacer16}
      snapToInterval={CARD_WIDTH + SPACINGS.SIXTEEN}
      decelerationRate="fast"
      showsHorizontalScrollIndicator={false}
    />
  );

export default React.memo(Collections);
