import React, {Fragment, useCallback, useMemo} from 'react';
import {useRoute, RouteProp, useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {COLORS} from '../../../../../shared/src/constants/colors';
import Screen from '../../../lib/components/Screen/Screen';
import {
  ExploreStackProps,
  OverlayStackProps,
} from '../../../lib/navigation/constants/routes';
import useCategoryById from '../../../lib/content/hooks/useCategoryById';
import AutoScrollView from '../../../lib/components/AutoScrollView/AutoScrollView';
import BottomFade from '../../../lib/components/BottomFade/BottomFade';
import useTagsByCategoryId from '../../../lib/content/hooks/useTagsByCategoryId';
import {
  Spacer16,
  Spacer28,
  Spacer32,
  Spacer4,
  TopSafeArea,
} from '../../../lib/components/Spacers/Spacer';
import {Column, Columns} from './components/Columns';
import StickyHeading from '../../../lib/components/StickyHeading/StickyHeading';
import {Heading16} from '../../../lib/components/Typography/Heading/Heading';
import useExercises from '../../../lib/content/hooks/useExercises';
import useCollections from '../../../lib/content/hooks/useCollections';
import ExerciseCard from '../../../lib/components/Cards/SessionCard/ExerciseCard';
import Gutters from '../../../lib/components/Gutters/Gutters';
import styled from 'styled-components/native';
import {useTranslation} from 'react-i18next';
import Collection from './components/Collection';
import Tag from './components/Tag';

const Tags = styled.ScrollView.attrs({
  horizontal: true,
  showsHorizontalScrollIndicator: false,
  deaccelerationRate: 'fast',
  contentContainerStyle: {
    paddingHorizontal: 12,
  },
})({});

const ExploreCategory = () => {
  const {
    params: {categoryId},
  } = useRoute<RouteProp<ExploreStackProps, 'ExploreCategory'>>();
  const {goBack, navigate} =
    useNavigation<
      NativeStackNavigationProp<OverlayStackProps & ExploreStackProps>
    >();
  const {t} = useTranslation('Screen.Explore');

  const [activeTags, setActiveTags] = React.useState<string[]>([]);

  const category = useCategoryById(categoryId);
  const tags = useTagsByCategoryId(categoryId);
  const collections = useCollections(category?.collections);
  const exercises = useExercises(category?.exercises);

  const filteredCollections = useMemo(
    () =>
      collections.filter(
        collection =>
          collection.tags?.some(
            tag => !activeTags.length || activeTags.includes(tag),
          ),
      ),
    [activeTags, collections],
  );

  const filteredExercises = useMemo(
    () =>
      exercises.filter(
        exercise =>
          exercise.tags?.some(
            tag => !activeTags.length || activeTags.includes(tag),
          ),
      ),
    [activeTags, exercises],
  );

  const onPressTag = useCallback(
    (tagId: string) => () => {
      setActiveTags(active =>
        active.includes(tagId)
          ? active.filter(id => id !== tagId)
          : [...active, tagId],
      );
    },
    [],
  );

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
      title={category?.name}>
      <TopSafeArea />
      <Spacer32 />
      <AutoScrollView stickyHeaderIndices={[3, 5]}>
        <Spacer16 />
        <Tags>
          {tags.map(tag => (
            <Fragment key={tag.id}>
              <Spacer4 />
              <Tag
                tag={tag}
                active={activeTags.includes(tag.id)}
                onPress={onPressTag(tag.id)}
              />
              <Spacer4 />
            </Fragment>
          ))}
        </Tags>
        <Spacer16 />
        {filteredCollections.length > 0 && (
          <StickyHeading>
            <Heading16>{t('collectionsHeading')}</Heading16>
          </StickyHeading>
        )}
        {filteredCollections.length > 0 && (
          <Columns>
            {filteredCollections.map(collection => (
              <Column key={collection.id}>
                <Collection
                  collection={collection}
                  onPress={onPressCollection(collection.id)}
                />
              </Column>
            ))}
          </Columns>
        )}
        {filteredExercises.length > 0 && (
          <StickyHeading>
            <Heading16>{t('sessionsHeading')}</Heading16>
          </StickyHeading>
        )}
        {filteredExercises.length > 0 && (
          <Gutters>
            {filteredExercises.map(exercise => (
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

export default ExploreCategory;
