import React from 'react';
import useExerciseById from '../../content/hooks/useExerciseById';
import styled from 'styled-components/native';
import {COLORS} from '../../../../../shared/src/constants/colors';
import CardSmall from '../Cards/CardSmall';
import {formatContentName} from '../../utils/string';
import TouchableOpacity from '../TouchableOpacity/TouchableOpacity';
import {Feedback} from '../../../../../shared/src/types/Feedback';
import FeedbackPostCard from './FeedbackPostCard';

type StyleProps = {
  backgroundColor: string;
};

const Wrapper = styled(TouchableOpacity)<StyleProps>(({backgroundColor}) => ({
  flex: 1,
  backgroundColor,
  borderTopLeftRadius: 16,
  borderTopRightRadius: 16,
  borderBottomLeftRadius: 24,
  borderBottomRightRadius: 24,
}));

const ExerciseCard = styled(CardSmall)<StyleProps>(({backgroundColor}) => ({
  backgroundColor,
}));

type Props = {
  feedbackPost: Feedback;
  clip?: boolean;
  backgroundColor?: string;
  onPress?: () => void;
};

const ExerciseFeedbackCard: React.FC<Props> = ({
  onPress,
  feedbackPost,
  clip,
  backgroundColor = COLORS.WHITE,
}) => {
  const exercise = useExerciseById(
    feedbackPost.exerciseId,
    feedbackPost.language,
  );

  if (!exercise) return null;

  return (
    <Wrapper onPress={onPress} backgroundColor={backgroundColor}>
      <ExerciseCard
        title={formatContentName(exercise)}
        cardStyle={exercise.card}
        backgroundColor={backgroundColor}
      />
      <FeedbackPostCard
        feedbackPost={feedbackPost}
        clip={clip}
        backgroundColor={backgroundColor}
      />
    </Wrapper>
  );
};

export default ExerciseFeedbackCard;
