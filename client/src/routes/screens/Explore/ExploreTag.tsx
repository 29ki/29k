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
import useExercisesByTags from '../../../lib/content/hooks/useExercisesByTags';
import useCollectionsByTags from '../../../lib/content/hooks/useCollectionsByTags';
import {useTranslation} from 'react-i18next';
import Collections from './components/Collections';
import useFeaturedExercisesByTags from '../../../lib/content/hooks/useFeaturedExercisesByTags';
import Sessions from './components/Sessions';
import {CollectionIcon} from '../../../lib/components/Icons';
import IconWrapper from './components/IconWrapper';
import useLiveSessionsByTags from '../../../lib/sessions/hooks/useLiveSessionsByTags';

const ExploreTag = () => {
  const {
    params: {tagId},
  } = useRoute<RouteProp<ExploreStackProps, 'ExploreTag'>>();
  const {goBack} =
    useNavigation<
      NativeStackNavigationProp<OverlayStackProps & ExploreStackProps>
    >();
  const {t} = useTranslation('Screen.Explore');

  const tag = useTagById(tagId);
  const tagFilter = useMemo(() => (tag ? [tag.id] : []), [tag]);
  const collections = useCollectionsByTags(tagFilter);
  const exercises = useExercisesByTags(tagFilter);
  const liveSessions = useLiveSessionsByTags(tagFilter);
  const featuredExercises = useFeaturedExercisesByTags(tagFilter);

  return (
    <Screen
      onPressBack={goBack}
      backgroundColor={COLORS.PURE_WHITE}
      title={tag?.name}>
      <TopSafeArea />
      <Spacer32 />
      <AutoScrollView stickyHeaderIndices={[1, 3, 5, 7]}>
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
        {featuredExercises.length > 0 && (
          <StickyHeading>
            <Heading16>{t('featuredHeading')}</Heading16>
          </StickyHeading>
        )}
        {featuredExercises.length > 0 && (
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
        {collections.length > 0 && <Collections collections={collections} />}
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
