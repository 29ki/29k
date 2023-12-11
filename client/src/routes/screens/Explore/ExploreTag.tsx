import React, {Fragment, useCallback, useMemo} from 'react';
import {useRoute, RouteProp, useNavigation} from '@react-navigation/native';
import {COLORS} from '../../../../../shared/src/constants/colors';
import Screen from '../../../lib/components/Screen/Screen';
import {
  ExploreStackProps,
  OverlayStackProps,
} from '../../../lib/navigation/constants/routes';
import Gutters from '../../../lib/components/Gutters/Gutters';
import useTagById from '../../../lib/content/hooks/useTagById';
import AutoScrollView from '../../../lib/components/AutoScrollView/AutoScrollView';
import BottomFade from '../../../lib/components/BottomFade/BottomFade';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import ExerciseCard from '../../../lib/components/Cards/SessionCard/ExerciseCard';
import {
  TopSafeArea,
  Spacer32,
  Spacer16,
  Spacer28,
} from '../../../lib/components/Spacers/Spacer';
import StickyHeading from '../../../lib/components/StickyHeading/StickyHeading';
import {Heading16} from '../../../lib/components/Typography/Heading/Heading';
import {Columns, Column} from './components/Columns';
import useExercisesByTags from '../../../lib/content/hooks/useExercisesByTags';
import useCollectionsByTags from '../../../lib/content/hooks/useCollectionsByTags';
import {useTranslation} from 'react-i18next';
import Collection from './components/Collection';

const ExploreTag = () => {
  const {
    params: {tagId},
  } = useRoute<RouteProp<ExploreStackProps, 'ExploreTag'>>();
  const {goBack, navigate} =
    useNavigation<
      NativeStackNavigationProp<OverlayStackProps & ExploreStackProps>
    >();
  const {t} = useTranslation('Screen.Explore');

  const tag = useTagById(tagId);
  const tagFilter = useMemo(() => (tag ? [tag.id] : []), [tag]);
  const exercises = useExercisesByTags(tagFilter);
  const collections = useCollectionsByTags(tagFilter);

  const onPressCollection = useCallback(
    (collectionId: string) => () => {
      navigate('Collection', {collectionId});
    },
    [navigate],
  );

  return (
    <Screen
      onPressBack={goBack}
      backgroundColor={COLORS.PURE_WHITE}
      title={tag?.name}>
      <TopSafeArea />
      <Spacer32 />
      <AutoScrollView stickyHeaderIndices={[1, 3]}>
        <Spacer16 />
        {collections.length > 0 && (
          <StickyHeading>
            <Heading16>{t('collectionsHeading')}</Heading16>
          </StickyHeading>
        )}
        {collections.length > 0 && (
          <Columns>
            {collections.map(collection => (
              <Column key={collection.id}>
                <Collection
                  collection={collection}
                  onPress={onPressCollection(collection.id)}
                />
              </Column>
            ))}
          </Columns>
        )}
        {exercises.length > 0 && (
          <StickyHeading>
            <Heading16>{t('sessionsHeading')}</Heading16>
          </StickyHeading>
        )}
        {exercises.length > 0 && (
          <Gutters>
            {exercises.map(exercise => (
              <Fragment key={exercise.id}>
                <ExerciseCard exercise={exercise} small />
                <Spacer16 />
              </Fragment>
            ))}
          </Gutters>
        )}
        <Spacer28 />
      </AutoScrollView>
      <BottomFade />
    </Screen>
  );
};

export default ExploreTag;
