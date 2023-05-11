import {useNavigation, useScrollToTop} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import React, {useCallback, useMemo, useRef} from 'react';
import {useTranslation} from 'react-i18next';
import {SectionList, SectionListRenderItem} from 'react-native';
import {FlatList} from 'react-native-gesture-handler';

import {COLORS} from '../../../../../shared/src/constants/colors';
import {Exercise} from '../../../../../shared/src/types/generated/Exercise';
import Gutters from '../../../lib/components/Gutters/Gutters';
import MiniProfile from '../../../lib/components/MiniProfile/MiniProfile';
import Screen from '../../../lib/components/Screen/Screen';
import CollectionCardContainer, {
  CARD_WIDTH,
} from './components/CollectionCardContainer';
import {
  Spacer16,
  Spacer20,
  Spacer32,
  Spacer48,
  Spacer8,
  TopSafeArea,
} from '../../../lib/components/Spacers/Spacer';
import StickyHeading from '../../../lib/components/StickyHeading/StickyHeading';
import TopBar from '../../../lib/components/TopBar/TopBar';
import {Heading16} from '../../../lib/components/Typography/Heading/Heading';
import {SPACINGS} from '../../../lib/constants/spacings';
import useExercises from '../../../lib/content/hooks/useExercises';
import useCollections from '../../../lib/content/hooks/useCollections';
import {OverlayStackProps} from '../../../lib/navigation/constants/routes';
import ExerciseCardContainer from '../../../lib/components/Cards/SessionCard/ExerciseCardContainer';
import BottomFade from '../../../lib/components/BottomFade/BottomFade';
import ComingSoonSlider from './components/ComingSoon';

export type ComingSoonItem = {when: string; what: string};
export type ComingSoon = {
  description: string;
  items: ComingSoonItem[];
};

type Section = {
  title: string;
  data: Exercise[];
};

const Explore = () => {
  const {navigate} =
    useNavigation<NativeStackNavigationProp<OverlayStackProps>>();
  const {t} = useTranslation('Screen.Explore');
  const exercises = useExercises();
  const collections = useCollections();
  const listRef = useRef<SectionList<Exercise, Section>>(null);
  const comingSoonSection: ComingSoon = t('comingSoon', {returnObjects: true});

  useScrollToTop(listRef);

  const onPressEllipsis = useCallback(() => {
    navigate('AboutOverlay');
  }, [navigate]);

  const exerciseSections = useMemo(() => {
    return [
      {
        title: t('sessionsHeading'),
        data: exercises,
      } as Section,
    ];
  }, [exercises, t]);

  const renderExerciseSectionHeader = useCallback<
    (info: {section: Section}) => React.ReactElement
  >(
    ({section: {title}}) => (
      <StickyHeading backgroundColor={COLORS.PURE_WHITE}>
        <Heading16>{title}</Heading16>
      </StickyHeading>
    ),
    [],
  );

  const renderExerciseItem = useCallback<
    SectionListRenderItem<Exercise, Section>
  >(({item, section, index}) => {
    const hasCardBefore = index > 0;
    const hasCardAfter = index !== section.data.length - 1;
    return (
      <Gutters>
        <ExerciseCardContainer
          exercise={item}
          hasCardBefore={hasCardBefore}
          hasCardAfter={hasCardAfter}
        />
      </Gutters>
    );
  }, []);

  return (
    <Screen backgroundColor={COLORS.PURE_WHITE}>
      <TopSafeArea minSize={SPACINGS.SIXTEEN} />
      <TopBar
        backgroundColor={COLORS.PURE_WHITE}
        onPressEllipsis={onPressEllipsis}>
        <MiniProfile />
      </TopBar>

      <SectionList
        ref={listRef}
        sections={exerciseSections}
        keyExtractor={exercise => exercise.id}
        ListHeaderComponent={
          <>
            {collections.length > 0 && (
              <Gutters>
                <Spacer20 />
                <Heading16>{t('collectionsHeading')}</Heading16>
                <Spacer8 />
                <FlatList
                  data={collections}
                  keyExtractor={collection => collection.id}
                  snapToAlignment="center"
                  decelerationRate="fast"
                  snapToInterval={CARD_WIDTH + SPACINGS.SIXTEEN}
                  showsHorizontalScrollIndicator={false}
                  horizontal
                  renderItem={({item}) => (
                    <>
                      <CollectionCardContainer collection={item} />
                      <Spacer16 />
                    </>
                  )}
                />
                <Spacer32 />
              </Gutters>
            )}
            {comingSoonSection.items?.length > 0 && (
              <Gutters>
                <Heading16>{t('comingSoonHeading')}</Heading16>
                <Spacer8 />
                <ComingSoonSlider comingSoonSection={comingSoonSection} />
              </Gutters>
            )}
          </>
        }
        renderSectionHeader={renderExerciseSectionHeader}
        ListFooterComponent={Spacer48}
        renderItem={renderExerciseItem}
      />
      <BottomFade />
    </Screen>
  );
};

export default Explore;
