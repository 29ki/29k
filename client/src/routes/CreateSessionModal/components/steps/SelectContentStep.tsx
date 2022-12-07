import React, {useMemo} from 'react';
import {BottomSheetFlatList} from '@gorhom/bottom-sheet';
import {useIsFocused} from '@react-navigation/native';
import {useCallback} from 'react';
import {useTranslation} from 'react-i18next';
import styled from 'styled-components/native';

import SETTINGS from '../../../../common/constants/settings';
import {COLORS} from '../../../../../../shared/src/constants/colors';
import {SPACINGS} from '../../../../common/constants/spacings';

import {Spacer16, Spacer24} from '../../../../common/components/Spacers/Spacer';
import {ModalHeading} from '../../../../common/components/Typography/Heading/Heading';
import useExerciseIds from '../../../../lib/content/hooks/useExerciseIds';
import {StepProps} from '../../CreateSessionModal';
import Gutters from '../../../../common/components/Gutters/Gutters';
import useExerciseById from '../../../../lib/content/hooks/useExerciseById';
import {Exercise} from '../../../../../../shared/src/types/generated/Exercise';
import {Display16} from '../../../../common/components/Typography/Display/Display';
import Image from '../../../../common/components/Image/Image';
import TouchableOpacity from '../../../../common/components/TouchableOpacity/TouchableOpacity';

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
          <Display16>{exercise?.name}</Display16>
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
}) => {
  const exerciseIds = useExerciseIds();

  const {t} = useTranslation('Modal.CreateSession');

  const renderItem = useCallback(
    ({item}: {item: Exercise['id']}) => (
      <ContentCard
        onPress={() => {
          setSelectedExercise(item);
          nextStep();
        }}
        exerciseId={item}
      />
    ),
    [setSelectedExercise, nextStep],
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
