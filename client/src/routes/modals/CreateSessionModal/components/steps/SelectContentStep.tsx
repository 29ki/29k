import React, {useMemo} from 'react';
import {BottomSheetFlatList} from '@gorhom/bottom-sheet';
import {useIsFocused, useNavigation} from '@react-navigation/native';
import {useCallback} from 'react';
import {useTranslation} from 'react-i18next';
import styled from 'styled-components/native';

import SETTINGS from '../../../../../lib/constants/settings';
import {COLORS} from '../../../../../../../shared/src/constants/colors';
import {SPACINGS} from '../../../../../lib/constants/spacings';

import {Spacer16, Spacer24} from '../../../../../lib/components/Spacers/Spacer';
import {ModalHeading} from '../../../../../lib/components/Typography/Heading/Heading';
import {StepProps} from '../../CreateSessionModal';
import Gutters from '../../../../../lib/components/Gutters/Gutters';
import {Exercise} from '../../../../../../../shared/src/types/generated/Exercise';
import {Display16} from '../../../../../lib/components/Typography/Display/Display';
import Image from '../../../../../lib/components/Image/Image';
import TouchableOpacity from '../../../../../lib/components/TouchableOpacity/TouchableOpacity';
import {formatExerciseName} from '../../../../../lib/utils/string';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {
  AppStackProps,
  ModalStackProps,
} from '../../../../../lib/navigation/constants/routes';
import {SessionMode} from '../../../../../../../shared/src/schemas/Session';
import useStartAsyncSession from '../../../../../lib/session/hooks/useStartAsyncSession';
import useGetExercisesByMode from '../../../../../lib/content/hooks/useGetExercisesByMode';

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
  exercise: Exercise;
  onPress: () => void;
}> = ({exercise, onPress}) => {
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
  selectedModeAndType,
}) => {
  const {popToTop} =
    useNavigation<NativeStackNavigationProp<AppStackProps & ModalStackProps>>();
  const exercises = useGetExercisesByMode(selectedModeAndType?.mode);
  const startSession = useStartAsyncSession();
  const {t} = useTranslation('Modal.CreateSession');

  const renderItem = useCallback(
    ({item}: {item: Exercise}) => (
      <ContentCard
        onPress={() => {
          setSelectedExercise(item.id);
          if (selectedModeAndType?.mode === SessionMode.async) {
            popToTop();
            startSession(item.id);
          } else {
            nextStep();
          }
        }}
        exercise={item}
      />
    ),
    [
      setSelectedExercise,
      nextStep,
      popToTop,
      startSession,
      selectedModeAndType,
    ],
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
        data={exercises}
        ItemSeparatorComponent={Spacer16}
        renderItem={renderItem}
      />
      <Spacer24 />
    </>
  );
};

export default SelectContentStep;
