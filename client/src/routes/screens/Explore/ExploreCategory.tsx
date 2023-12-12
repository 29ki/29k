import React, {Fragment, useCallback} from 'react';
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
import useFeaturedExercises from '../../../lib/content/hooks/useFeaturedExercises';
import Sessions from './components/Sessions';
import {CollectionIcon} from '../../../lib/components/Icons';
import IconWrapper from './components/IconWrapper';
import useLiveSessionsByExercises from '../../../lib/sessions/hooks/useLiveSessionsByExerciseIds';
import useFilterContentByTags from '../../../lib/content/hooks/useFilterContentByTags';

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
  const {goBack} =
    useNavigation<
      NativeStackNavigationProp<OverlayStackProps & ExploreStackProps>
    >();
  const {t} = useTranslation('Screen.Explore');

  const [activeTags, setActiveTags] = React.useState<string[]>([]);

  const category = useCategoryById(categoryId);
  const tags = useTagsByCategoryId(categoryId);
  const collections = useFilterContentByTags(
    useCollections(category?.collections),
    activeTags,
  );
  const exercises = useFilterContentByTags(
    useExercises(category?.exercises),
    activeTags,
  );
  const featuredExercises = useFilterContentByTags(
    useFeaturedExercises(category?.exercises),
    activeTags,
  );
  const liveSessions = useLiveSessionsByExercises(exercises);

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

  return (
    <Screen
      onPressBack={goBack}
      backgroundColor={COLORS.PURE_WHITE}
      title={category?.name}>
      <TopSafeArea />
      <Spacer32 />
      <AutoScrollView stickyHeaderIndices={[3, 5, 7, 9]}>
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
        {liveSessions.length > 0 && (
          <StickyHeading>
            <Heading16>{t('liveSessionsHeading')}</Heading16>
          </StickyHeading>
        )}
        {liveSessions.length > 0 && (
          <>
            <Sessions sessions={liveSessions} />
            <Spacer16 />
          </>
        )}
        {!activeTags.length && featuredExercises.length > 0 && (
          <StickyHeading>
            <Heading16>{t('featuredHeading')}</Heading16>
          </StickyHeading>
        )}
        {!activeTags.length && featuredExercises.length > 0 && (
          <>
            <Sessions sessions={featuredExercises} />
            <Spacer16 />
          </>
        )}
        {collections.length > 0 && (
          <StickyHeading>
            <IconWrapper Icon={CollectionIcon}>
              <Heading16>{t('collectionsHeading')}</Heading16>
            </IconWrapper>
          </StickyHeading>
        )}
        {collections.length > 0 && (
          <Columns>
            {collections.map(collection => (
              <Column key={collection.id}>
                <Collection collection={collection} />
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

export default ExploreCategory;
