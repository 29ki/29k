import React, {Fragment, useMemo} from 'react';
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
import {Choices, Choice, Collection, Label} from './Choices';
import useExercisesByTags from '../../../lib/content/hooks/useExercisesByTags';
import useCollectionsByTags from '../../../lib/content/hooks/useCollectionsByTags';

const ExploreTag = () => {
  const {
    params: {tagId},
  } = useRoute<RouteProp<ExploreStackProps, 'ExploreTag'>>();
  const {goBack, navigate} =
    useNavigation<
      NativeStackNavigationProp<OverlayStackProps & ExploreStackProps>
    >();

  const tag = useTagById(tagId);
  const tagFilter = useMemo(() => (tag ? [tag.id] : []), [tag]);
  const exercises = useExercisesByTags(tagFilter);
  const collections = useCollectionsByTags(tagFilter);

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
            <Heading16>Collections</Heading16>
          </StickyHeading>
        )}
        {collections.length > 0 && (
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
        )}
        {exercises.length > 0 && (
          <StickyHeading>
            <Heading16>Sessions</Heading16>
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
