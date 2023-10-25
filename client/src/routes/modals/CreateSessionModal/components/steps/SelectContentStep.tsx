import React from 'react';
import {BottomSheetFlatList} from '@gorhom/bottom-sheet';
import {useIsFocused, useNavigation} from '@react-navigation/native';
import {useCallback} from 'react';
import {useTranslation} from 'react-i18next';

import {Spacer16, Spacer24} from '../../../../../lib/components/Spacers/Spacer';
import {ModalHeading} from '../../../../../lib/components/Typography/Heading/Heading';
import {StepProps} from '../../CreateSessionModal';
import Gutters from '../../../../../lib/components/Gutters/Gutters';
import {Exercise} from '../../../../../../../shared/src/types/generated/Exercise';
import {formatContentName} from '../../../../../lib/utils/string';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {
  AppStackProps,
  ModalStackProps,
} from '../../../../../lib/navigation/constants/routes';
import {SessionMode} from '../../../../../../../shared/src/schemas/Session';
import useStartAsyncSession from '../../../../../lib/session/hooks/useStartAsyncSession';
import useGetExercisesByMode from '../../../../../lib/content/hooks/useGetExercisesByMode';
import CardSmall from '../../../../../lib/components/Cards/CardSmall';

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
      <Gutters>
        <CardSmall
          title={formatContentName(item)}
          graphic={item?.card}
          onPress={() => {
            setSelectedExercise(item.id);
            if (selectedModeAndType?.mode === SessionMode.async) {
              popToTop();
              startSession(item.id);
            } else {
              nextStep();
            }
          }}
        />
      </Gutters>
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
