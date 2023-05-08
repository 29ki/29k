import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import React, {useCallback, useMemo} from 'react';
import {Exercise} from '../../../../../../shared/src/types/generated/Exercise';
import {ModalStackProps} from '../../../navigation/constants/routes';
import {formatContentName} from '../../../utils/string';
import ExerciseWalletCard from '../WalletCards/ExerciseWalletCard';
import useStartAsyncSession from '../../../session/hooks/useStartAsyncSession';

type ExerciseCardContainerProps = {
  exercise: Exercise;
  hasCardBefore: boolean;
  hasCardAfter: boolean;
  startImmediatly?: boolean;
};

const ExerciseCardContainer: React.FC<ExerciseCardContainerProps> = ({
  exercise,
  hasCardBefore,
  hasCardAfter,
  startImmediatly,
}) => {
  const {navigate} =
    useNavigation<NativeStackNavigationProp<ModalStackProps>>();
  const startSessions = useStartAsyncSession();

  const image = useMemo(() => {
    if (exercise?.card?.image) {
      return {uri: exercise.card.image.source};
    }
  }, [exercise]);

  const onPress = useCallback(() => {
    if (startImmediatly) {
      startSessions(exercise.id);
    } else {
      navigate('CreateSessionModal', {exerciseId: exercise.id});
    }
  }, [exercise, startImmediatly, navigate, startSessions]);

  if (!exercise) {
    return null;
  }

  return (
    <ExerciseWalletCard
      title={formatContentName(exercise)}
      image={image}
      hasCardBefore={hasCardBefore}
      hasCardAfter={hasCardAfter}
      onPress={onPress}
    />
  );
};

export default React.memo(ExerciseCardContainer);
