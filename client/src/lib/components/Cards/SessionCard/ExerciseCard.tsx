import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import React, {useCallback} from 'react';
import {ModalStackProps} from '../../../navigation/constants/routes';
import {formatContentName} from '../../../utils/string';
import CardSmall from '../CardSmall';
import {ViewStyle} from 'react-native';
import Card from '../Card';
import useGetSessionCardTags from './hooks/useGetSessionCardTags';
import useGetActiveCollectionByExerciseId from '../../../content/hooks/useGetActiveCollectionByExerciseId';
import {ExerciseWithLanguage} from '../../../content/types';

type ExerciseCardContainerProps = {
  exercise: ExerciseWithLanguage;
  small?: boolean;
  resolvePinnedCollection?: boolean;
  onPress?: () => void;
  style?: ViewStyle;
  backgroundColor?: string;
  textColor?: string;
};

const ExerciseCard: React.FC<ExerciseCardContainerProps> = ({
  exercise,
  small,
  resolvePinnedCollection,
  onPress = () => {},
  style,
  backgroundColor,
  textColor,
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
        cardStyle={exercise?.card}
        collection={collection}
        onPress={onPressHandle}
        style={style}
        backgroundColor={backgroundColor}
        textColor={textColor}
      />
    );
  }

  return (
    <Card
      title={formatContentName(exercise)}
      description={exercise.description}
      language={exercise.language}
      tags={tags}
      cardStyle={exercise.card}
      collection={collection}
      onPress={onPressHandle}
      style={style}
      backgroundColor={backgroundColor}
      textColor={textColor}
    />
  );
};

export default React.memo(ExerciseCard);
