import React, {useMemo} from 'react';
import {BottomSheetFlatList} from '@gorhom/bottom-sheet';
import {useIsFocused, useNavigation} from '@react-navigation/native';
import {useCallback} from 'react';
import {useTranslation} from 'react-i18next';
import styled from 'styled-components/native';

import SETTINGS from '../../../../lib/constants/settings';
import {COLORS} from '../../../../../../shared/src/constants/colors';
import {SPACINGS} from '../../../../lib/constants/spacings';

import {Spacer16, Spacer24} from '../../../../lib/components/Spacers/Spacer';
import {ModalHeading} from '../../../../lib/components/Typography/Heading/Heading';
import useExerciseIds from '../../../../lib/content/hooks/useExerciseIds';
import {StepProps} from '../../CreateSessionModal';
import Gutters from '../../../../lib/components/Gutters/Gutters';
import useExerciseById from '../../../../lib/content/hooks/useExerciseById';
import {Exercise} from '../../../../../../shared/src/types/generated/Exercise';
import {Display16} from '../../../../lib/components/Typography/Display/Display';
import Image from '../../../../lib/components/Image/Image';
import TouchableOpacity from '../../../../lib/components/TouchableOpacity/TouchableOpacity';
import {formatExerciseName} from '../../../../lib/utils/string';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {
  AppStackProps,
  ModalStackProps,
} from '../../../../lib/navigation/constants/routes';
import {
  AsyncSession,
  SessionType,
} from '../../../../../../shared/src/types/Session';
import useLogAsyncSessionMetricEvents from '../../../../lib/sessions/hooks/useLogAsyncSessionMetricEvents';
import {LANGUAGE_TAG} from '../../../../lib/i18n';
import dayjs from 'dayjs';

const Card = styled(TouchableOpacity)({
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  borderRadius: SETTINGS.BORDER_RADIUS.CARDS,
  paddingRight: 0,
  paddingLeft: SPACINGS.SIXTEEN,
  backgroundColor: COLORS.CREAM,
  overflow: 'hidden',
});

const TextWrapper = styled.View({
  flex: 2,
  paddingVertical: SPACINGS.SIXTEEN,
});

const CardImageWrapper = styled.View({
  width: 80,
  height: 80,
});

const ContentCard: React.FC<{
  exerciseId: Exercise['id'];
  onPress: () => void;
}> = ({exerciseId, onPress}) => {
  const exercise = useExerciseById(exerciseId);
  const exerciseImg = useMemo(
    () => ({uri: exercise?.card?.image?.source}),
    [exercise],
  );

  return (
    <Gutters>
      <Card onPress={onPress}>
        <TextWrapper>
          <Display16>{formatExerciseName(exercise)}</Display16>
        </TextWrapper>
        <Spacer16 />
        <CardImageWrapper>
          <Image source={exerciseImg} />
        </CardImageWrapper>
      </Card>
    </Gutters>
  );
};

const SelectContentStep: React.FC<StepProps> = ({
  nextStep,
  setSelectedExercise,
  selectedType,
}) => {
  const {navigate, popToTop} =
    useNavigation<NativeStackNavigationProp<AppStackProps & ModalStackProps>>();
  const exerciseIds = useExerciseIds();
  const logAsyncSessionMetricEvent = useLogAsyncSessionMetricEvents();

  const {t, i18n} = useTranslation('Modal.CreateSession');

  const startAsyncSession = useCallback(
    (exerciseId: string) => {
      const session: AsyncSession = {
        type: SessionType.async,
        id: 'test', // TODO generate,
        startTime: dayjs().utc().toJSON(),
        contentId: exerciseId,
        language: i18n.resolvedLanguage as LANGUAGE_TAG,
      };
      navigate('AsyncSessionStack', {
        screen: 'IntroPortal',
        params: {
          session,
        },
      });
      logAsyncSessionMetricEvent('Create Async Session', session);
    },
    [navigate, logAsyncSessionMetricEvent, i18n.resolvedLanguage],
  );

  const renderItem = useCallback(
    ({item}: {item: Exercise['id']}) => (
      <ContentCard
        onPress={() => {
          setSelectedExercise(item);
          if (selectedType === 'async') {
            popToTop();
            startAsyncSession(item);
          } else {
            nextStep();
          }
        }}
        exerciseId={item}
      />
    ),
    [setSelectedExercise, nextStep, popToTop, startAsyncSession, selectedType],
  );

  return (
    <>
      <BottomSheetFlatList
        ListHeaderComponent={
          <>
            <ModalHeading>{t('selectContent.title')}</ModalHeading>
            <Spacer16 />
          </>
        }
        focusHook={useIsFocused}
        data={exerciseIds}
        ItemSeparatorComponent={Spacer16}
        renderItem={renderItem}
      />
      <Spacer24 />
    </>
  );
};

export default SelectContentStep;
