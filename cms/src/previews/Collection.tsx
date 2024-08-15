import {useMemo} from 'react';
import {PreviewTemplateComponentProps} from 'decap-cms-core';
import {MobileWidth} from './components/MobileView';
import {
  Spacer16,
  Spacer24,
} from '../../../client/src/lib/components/Spacers/Spacer';
import CollectionFullCard from '../../../client/src/lib/components/Cards/CollectionCards/CollectionFullCard';
import {CollectionWithLanguage} from '../../../client/src/lib/content/types';

const onPress = () => undefined;

const CollectionPreview = (props: PreviewTemplateComponentProps) => {
  const collection = props.entry.get('data').toJS() as CollectionWithLanguage;

  const progressItems = useMemo(
    () => collection.exercises.map(() => false),
    [collection.exercises],
  );

  if (props.isLoadingAsset) return null;

  return (
    <MobileWidth>
      <Spacer24 />
      <CollectionFullCard
        collection={collection}
        progressItems={progressItems}
        onPress={onPress}
      />
      <Spacer16 />
    </MobileWidth>
  );
};

export default CollectionPreview;
