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

type ExerciseCardContainerProps = {
  exercise: Exercise;
  small?: boolean;
  onPress?: () => void;
  style?: ViewStyle;
};

const ExerciseCard: React.FC<ExerciseCardContainerProps> = ({
  exercise,
  small,
  onPress = () => {},
  style,
}) => {
  const {navigate} =
    useNavigation<NativeStackNavigationProp<ModalStackProps>>();
  const tags = useGetSessionCardTags(exercise);

  const onPressHandle = useCallback(() => {
    onPress();
    navigate('CreateSessionModal', {exerciseId: exercise.id});
  }, [exercise, onPress, navigate]);

  if (!exercise) {
    return null;
  }

  if (small) {
    return (
      <CardSmall
        title={formatContentName(exercise)}
        graphic={exercise?.card}
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
      onPress={onPressHandle}
      style={style}
    />
  );
};

export default React.memo(ExerciseCard);
