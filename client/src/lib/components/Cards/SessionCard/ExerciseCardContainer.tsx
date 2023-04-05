import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import React, {useCallback, useMemo} from 'react';
import {Exercise} from '../../../../../../shared/src/types/generated/Exercise';
import {ModalStackProps} from '../../../navigation/constants/routes';
import {formatExerciseName} from '../../../utils/string';
import ExerciseWalletCard from '../WalletCards/ExerciseWalletCard';

type ExerciseCardContainerProps = {
  exercise: Exercise;
  hasCardBefore: boolean;
  hasCardAfter: boolean;
};

const ExerciseCardContainer: React.FC<ExerciseCardContainerProps> = ({
  exercise,
  hasCardBefore,
  hasCardAfter,
}) => {
  const {navigate} =
    useNavigation<NativeStackNavigationProp<ModalStackProps>>();

  const image = useMemo(() => {
    if (exercise?.card?.image) {
      return {uri: exercise.card.image.source};
    }
  }, [exercise]);

  const onPress = useCallback(() => {
    navigate('CreateSessionModal', {exerciseId: exercise.id});
  }, [exercise, navigate]);

  if (!exercise) {
    return null;
  }

  return (
    <ExerciseWalletCard
      title={formatExerciseName(exercise)}
      image={image}
      hasCardBefore={hasCardBefore}
      hasCardAfter={hasCardAfter}
      onPress={onPress}
    />
  );
};

export default React.memo(ExerciseCardContainer);
