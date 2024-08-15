import React, {Fragment, useCallback, useRef} from 'react';
import {ScrollView} from 'react-native';
import AutoScrollView from '../../../lib/components/AutoScrollView/AutoScrollView';
import StickyHeading from '../../../lib/components/StickyHeading/StickyHeading';
import {Heading16} from '../../../lib/components/Typography/Heading/Heading';
import {
  Spacer16,
  Spacer28,
  TopSafeArea,
} from '../../../lib/components/Spacers/Spacer';
import Screen from '../../../lib/components/Screen/Screen';
import {COLORS} from '../../../../../shared/src/constants/colors';
import BottomFade from '../../../lib/components/BottomFade/BottomFade';
import TopBar from '../../../lib/components/TopBar/TopBar';
import MiniProfile from '../../../lib/components/MiniProfile/MiniProfile';
import {useNavigation, useScrollToTop} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {
  ExploreStackProps,
  OverlayStackProps,
} from '../../../lib/navigation/constants/routes';
import useCategories from '../../../lib/content/hooks/useCategories';
import useCollections from '../../../lib/content/hooks/useCollections';
import useTags from '../../../lib/content/hooks/useTags';
import {Columns, Column} from './components/Columns';
import {useTranslation} from 'react-i18next';
import Category from './components/Category';
import Collection from './components/Collection';
import Tag from './components/Tag';
import useExercises from '../../../lib/content/hooks/useExercises';
import Gutters from '../../../lib/components/Gutters/Gutters';
import ExerciseCard from '../../../lib/components/Cards/SessionCard/ExerciseCard';
import useFeaturedExercises from '../../../lib/content/hooks/useFeaturedExercises';
import Sessions from './components/Sessions';
import {CollectionIcon} from '../../../lib/components/Icons';
import IconWrapper from './components/IconWrapper';
import {SPACINGS} from '../../../lib/constants/spacings';

const Explore = () => {
  const {navigate} =
    useNavigation<
      NativeStackNavigationProp<OverlayStackProps & ExploreStackProps>
    >();
  const {t} = useTranslation('Screen.Explore');
  const scrollRef = useRef<ScrollView>(null);

  useScrollToTop(scrollRef);

  const categories = useCategories();
  const collections = useCollections();
  const tags = useTags();
  const exercises = useExercises();
  const featuredExercises = useFeaturedExercises();

  const onPressEllipsis = useCallback(() => {
    navigate('AboutOverlay');
  }, [navigate]);

  const onPressTag = useCallback(
    (tagId: string) => () => {
      navigate('ExploreTag', {tagId});
    },
    [navigate],
  );

  return (
    <Screen backgroundColor={COLORS.PURE_WHITE}>
      <TopSafeArea minSize={SPACINGS.SIXTEEN} />
      <TopBar
        backgroundColor={COLORS.PURE_WHITE}
        onPressEllipsis={onPressEllipsis}>
        <MiniProfile />
      </TopBar>
      <AutoScrollView ref={scrollRef} stickyHeaderIndices={[2, 4, 6, 8]}>
        <Spacer16 />
        <Columns>
          {categories.map(category => (
            <Column key={category.id}>
              <Category category={category} />
            </Column>
          ))}
        </Columns>
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
        <StickyHeading>
          <IconWrapper Icon={CollectionIcon}>
            <Heading16>{t('collectionsHeading')}</Heading16>
          </IconWrapper>
        </StickyHeading>
        <Columns>
          {collections.map(collection => (
            <Column key={collection.id}>
              <Collection collection={collection} />
            </Column>
          ))}
        </Columns>
        <StickyHeading>
          <Heading16>{t('skillsHeading')}</Heading16>
        </StickyHeading>
        <Columns>
          {tags.map(tag => (
            <Column key={tag.id}>
              <Tag tag={tag} onPress={onPressTag(tag.id)} />
            </Column>
          ))}
        </Columns>
        <StickyHeading>
          <Heading16>{t('sessionsHeading')}</Heading16>
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

export default Explore;
