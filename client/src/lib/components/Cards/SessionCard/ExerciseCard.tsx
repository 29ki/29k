import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import React, {useCallback} from 'react';
import {Exercise} from '../../../../../../shared/src/types/generated/Exercise';
import {ModalStackProps} from '../../../navigation/constants/routes';
import {formatContentName} from '../../../utils/string';
import CardSmall from '../CardSmall';
import {ViewStyle} from 'react-native';
import Card from '../Card';

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
      graphic={exercise.card}
      onPress={onPressHandle}
      style={style}
    />
  );
};

export default React.memo(ExerciseCard);
