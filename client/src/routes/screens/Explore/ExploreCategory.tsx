import React, {Fragment} from 'react';
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
  Spacer8,
  TopSafeArea,
} from '../../../lib/components/Spacers/Spacer';
import {Choice, Choices, Collection, Exercise, Label, Tag} from './Choices';
import StickyHeading from '../../../lib/components/StickyHeading/StickyHeading';
import {Heading16} from '../../../lib/components/Typography/Heading/Heading';
import useExercises from '../../../lib/content/hooks/useExercises';
import useCollections from '../../../lib/content/hooks/useCollections';
import ExerciseCard from '../../../lib/components/Cards/SessionCard/ExerciseCard';
import Gutters from '../../../lib/components/Gutters/Gutters';

const ExploreCategory = () => {
  const {
    params: {categoryId},
  } = useRoute<RouteProp<ExploreStackProps, 'ExploreCategory'>>();
  const {goBack, navigate} =
    useNavigation<
      NativeStackNavigationProp<OverlayStackProps & ExploreStackProps>
    >();

  const category = useCategoryById(categoryId);
  const tags = useTagsByCategoryId(categoryId);
  const collections = useCollections(category?.collections);
  const exercises = useExercises(category?.exercises);

  return (
    <Screen
      onPressBack={goBack}
      backgroundColor={COLORS.PURE_WHITE}
      title={category?.name}>
      <TopSafeArea />
      <Spacer32 />
      <AutoScrollView stickyHeaderIndices={[3, 5]}>
        <Choices>
          {tags.map(tag => (
            <Choice key={tag.id}>
              <Tag>
                <Label>{tag.name}</Label>
              </Tag>
            </Choice>
          ))}
        </Choices>
        <StickyHeading>
          <Heading16>Collections</Heading16>
        </StickyHeading>
        <Choices>
          {collections.map(collection => (
            <Choice
              key={collection.id}
              onPress={() =>
                navigate('Collection', {collectionId: collection.id})
              }>
              <Collection>
                <Label>{collection.name}</Label>
              </Collection>
            </Choice>
          ))}
        </Choices>
        <StickyHeading>
          <Heading16>Sessions</Heading16>
        </StickyHeading>
        <Gutters>
          {exercises.map(exercise => (
            <Fragment key={exercise.id}>
              <ExerciseCard exercise={exercise} small />
              <Spacer16 />
            </Fragment>
          ))}
        </Gutters>
        <Spacer28 />
      </AutoScrollView>
      <BottomFade />
    </Screen>
  );
};

export default ExploreCategory;
