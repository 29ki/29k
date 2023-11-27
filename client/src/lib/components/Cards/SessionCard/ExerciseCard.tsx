import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import React, {useCallback} from 'react';
import {Exercise} from '../../../../../../shared/src/types/generated/Exercise';
import {ModalStackProps} from '../../../navigation/constants/routes';
import {formatContentName} from '../../../utils/string';
import CardSmall from '../CardSmall';
import {ViewStyle} from 'react-native';
import Card from '../Card';
import useGetSessionCardTags from './hooks/useGetSessionCardTags';
import useGetActiveCollectionByExerciseId from '../../../content/hooks/useGetActiveCollectionByExerciseId';

type ExerciseCardContainerProps = {
  exercise: Exercise;
  small?: boolean;
  resolvePinnedCollection?: boolean;
  onPress?: () => void;
  style?: ViewStyle;
};

const ExerciseCard: React.FC<ExerciseCardContainerProps> = ({
  exercise,
  small,
  resolvePinnedCollection,
  onPress = () => {},
  style,
}) => {
  const {navigate} =
    useNavigation<NativeStackNavigationProp<ModalStackProps>>();
  const tags = useGetSessionCardTags(exercise);
  const getActiveCollectionByExerciseId = useGetActiveCollectionByExerciseId();

  const onPressHandle = useCallback(() => {
    onPress();
    navigate('CreateSessionModal', {exerciseId: exercise.id});
  }, [exercise, onPress, navigate]);

  if (!exercise) {
    return null;
  }

  const collection = resolvePinnedCollection
    ? getActiveCollectionByExerciseId(exercise.id)
    : undefined;

  if (small) {
    return (
      <CardSmall
        title={formatContentName(exercise)}
        graphic={exercise?.card}
        collection={collection}
        onPress={onPressHandle}
        style={style}
      />
    );
  }

  return (
    <Card
      title={formatContentName(exercise)}
      description={exercise.description}
      tags={tags}
      graphic={exercise.card}
      collection={collection}
      onPress={onPressHandle}
      style={style}
    />
  );
};

export default React.memo(ExerciseCard);
