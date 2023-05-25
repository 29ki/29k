import {RouteProp, useNavigation, useRoute} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import hexToRgba from 'hex-to-rgba';
import React, {useCallback, useMemo} from 'react';
import {useTranslation} from 'react-i18next';
import {SectionList, SectionListRenderItem} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import styled from 'styled-components/native';
import {COLORS} from '../../../../../shared/src/constants/colors';
import {Exercise} from '../../../../../shared/src/types/generated/Exercise';
import CompletedSessionCard from '../../../lib/components/Cards/SessionCard/CompletedSessionCard';
import ExerciseCardContainer from '../../../lib/components/Cards/SessionCard/ExerciseCardContainer';
import Gutters from '../../../lib/components/Gutters/Gutters';
import Image from '../../../lib/components/Image/Image';
import Screen from '../../../lib/components/Screen/Screen';
import {
  Spacer16,
  Spacer24,
  Spacer32,
  Spacer48,
  Spacer8,
  TopSafeArea,
} from '../../../lib/components/Spacers/Spacer';
import StickyHeading from '../../../lib/components/StickyHeading/StickyHeading';
import {Display20} from '../../../lib/components/Typography/Display/Display';
import {Heading16} from '../../../lib/components/Typography/Heading/Heading';
import useCollectionById from '../../../lib/content/hooks/useCollectionById';
import useExercisesByCollectionId from '../../../lib/content/hooks/useExercisesByCollectionId';
import {
  AppStackProps,
  ExploreStackProps,
} from '../../../lib/navigation/constants/routes';
import useCompletedSessionByTime from '../../../lib/user/hooks/useCompletedSessionByTime';
import usePinCollection from '../../../lib/user/hooks/usePinCollection';
import usePinnedCollectionById from '../../../lib/user/hooks/usePinnedCollectionById';
import {formatContentName} from '../../../lib/utils/string';
import Markdown from '../../../lib/components/Typography/Markdown/Markdown';
import AnimatedButton from '../../../lib/components/Buttons/AnimatedButton';
import {AnimatedPlusToCheck} from '../../../lib/components/Icons/AnimatedPlusToCheck/AnimatedPlusToCheck';

type Section = {
  title: string;
  data: Exercise[];
};

const Row = styled.View({
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  flex: 1,
});

const JourneyButton = styled(AnimatedButton)({
  alignSelf: 'flex-start',
});

const LeftColumn = styled.View({
  flex: 1,
  minHeight: 134,
  justifyContent: 'space-between',
});

const GraphicsWrapper = styled.View({
  width: 134,
  height: 134,
});

const Wrapper = styled.View({flex: 1});

const BottomGradient = styled(LinearGradient)({
  position: 'absolute',
  left: 0,
  right: 0,
  bottom: 0,
  height: 40,
});

const Collection = () => {
  const {
    params: {collectionId},
  } = useRoute<RouteProp<ExploreStackProps, 'Collection'>>();
  const {goBack} = useNavigation<NativeStackNavigationProp<AppStackProps>>();
  const {t} = useTranslation('Screen.Collection');
  const collection = useCollectionById(collectionId);
  const exercises = useExercisesByCollectionId(collectionId);
  const savedCollection = usePinnedCollectionById(collectionId);
  const {getCompletedSessionByExerciseId} = useCompletedSessionByTime();
  const {togglePinned, isPinned} = usePinCollection(collectionId);

  const colors = useMemo(
    () => [hexToRgba(COLORS.WHITE, 0), hexToRgba(COLORS.WHITE, 1)],
    [],
  );

  const image = useMemo(
    () => ({
      uri: collection?.image?.source,
    }),
    [collection],
  );

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
      <StickyHeading backgroundColor={COLORS.GREYLIGHTEST}>
        <Heading16>{title}</Heading16>
      </StickyHeading>
    ),
    [],
  );

  const renderExerciseItem = useCallback<
    SectionListRenderItem<Exercise, Section>
  >(
    ({item, section, index}) => {
      const hasCardBefore = index > 0;
      const hasCardAfter = index !== section.data.length - 1;
      const completedExerciseEvent = savedCollection
        ? getCompletedSessionByExerciseId(item.id, savedCollection.startedAt)
        : undefined;
      return (
        <Gutters>
          {completedExerciseEvent ? (
            <CompletedSessionCard
              completedSessionEvent={completedExerciseEvent}
              hasCardBefore={hasCardBefore}
              hasCardAfter={hasCardAfter}
            />
          ) : (
            <ExerciseCardContainer
              exercise={item}
              hasCardBefore={hasCardBefore}
              hasCardAfter={hasCardAfter}
            />
          )}
        </Gutters>
      );
    },
    [savedCollection, getCompletedSessionByExerciseId],
  );

  return (
    <Screen
      onPressBack={goBack}
      backgroundColor={COLORS.GREYLIGHTEST}
      title={t('collectionHeading')}>
      <Wrapper>
        <TopSafeArea />
        <Spacer32 />

        <SectionList
          sections={exerciseSections}
          keyExtractor={exercise => exercise.id}
          ListHeaderComponent={
            <Gutters>
              <Spacer32 />
              <Row>
                <LeftColumn>
                  <Spacer8 />
                  <Display20 numberOfLines={3}>
                    {formatContentName(collection)}
                  </Display20>
                  <Spacer16 />
                  <Markdown>{collection?.description}</Markdown>
                </LeftColumn>
                <Spacer16 />
                <GraphicsWrapper>
                  <Image source={image} />
                </GraphicsWrapper>
              </Row>

              <Spacer16 />
              <JourneyButton
                small
                onPress={togglePinned}
                preVariant="secondary"
                postVariant="primary"
                AnimatedIcon={AnimatedPlusToCheck}
                fill={COLORS.WHITE}
                active={isPinned}>
                {t('addToJourney')}
              </JourneyButton>

              <Spacer24 />
            </Gutters>
          }
          renderSectionHeader={renderExerciseSectionHeader}
          ListFooterComponent={Spacer48}
          renderItem={renderExerciseItem}
        />
      </Wrapper>
      <BottomGradient colors={colors} />
    </Screen>
  );
};

export default Collection;
