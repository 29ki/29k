import React from 'react';
import {formatContentName} from '../../../utils/string';
import CardSmall from '../CardSmall';
import {ViewStyle} from 'react-native';
import Card from '../Card';
import useGetSessionCardTags from './hooks/useGetSessionCardTags';
import {ExerciseWithLanguage} from '../../../content/types';

type ExerciseCardContainerProps = {
  exercise: ExerciseWithLanguage;
  small?: boolean;
  resolvePinnedCollection?: boolean;
  style?: ViewStyle;
  backgroundColor?: string;
  textColor?: string;
};

const ExerciseCard: React.FC<ExerciseCardContainerProps> = ({
  exercise,
  small,
  style,
  backgroundColor,
  textColor,
}) => {
  const tags = useGetSessionCardTags(exercise);

  if (!exercise) {
    return null;
  }

  if (small) {
    return (
      <CardSmall
        title={formatContentName(exercise)}
        language={exercise.language}
        cardStyle={exercise?.card}
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
      style={style}
      backgroundColor={backgroundColor}
      textColor={textColor}
    />
  );
};

export default React.memo(ExerciseCard);
