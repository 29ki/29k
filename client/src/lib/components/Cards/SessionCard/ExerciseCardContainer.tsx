import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import React, {useCallback, useMemo} from 'react';
import {Exercise} from '../../../../../../shared/src/types/generated/Exercise';
import {ModalStackProps} from '../../../navigation/constants/routes';
import {formatContentName} from '../../../utils/string';
import ExerciseWalletCard from '../WalletCards/ExerciseWalletCard';

type ExerciseCardContainerProps = {
  exercise: Exercise;
  hasCardBefore: boolean;
  hasCardAfter: boolean;
  onPress?: () => void;
};

const ExerciseCardContainer: React.FC<ExerciseCardContainerProps> = ({
  exercise,
  hasCardBefore,
  hasCardAfter,
  onPress = () => {},
}) => {
  const {navigate} =
    useNavigation<NativeStackNavigationProp<ModalStackProps>>();

  const image = useMemo(() => {
    if (exercise?.card?.image) {
      return {uri: exercise.card.image.source};
    }
  }, [exercise]);

  const lottie = useMemo(() => {
    if (exercise?.card?.lottie?.source) {
      return {uri: exercise.card.lottie.source};
    }
  }, [exercise]);

  const onPressHandle = useCallback(() => {
    onPress();
    navigate('CreateSessionModal', {exerciseId: exercise.id});
  }, [exercise, onPress, navigate]);

  if (!exercise) {
    return null;
  }

  return (
    <ExerciseWalletCard
      title={formatContentName(exercise)}
      image={image}
      lottie={lottie}
      hasCardBefore={hasCardBefore}
      hasCardAfter={hasCardAfter}
      onPress={onPressHandle}
    />
  );
};

export default React.memo(ExerciseCardContainer);
