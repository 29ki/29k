import React from 'react';
import {PostEvent} from '../../../../../shared/src/types/Event';
import useExerciseById from '../../content/hooks/useExerciseById';
import {PostItem} from '../../posts/types/PostItem';
import SharingPostCard from './SharingPostCard';
import styled from 'styled-components/native';
import {COLORS} from '../../../../../shared/src/constants/colors';
import CardSmall from '../Cards/CardSmall';
import {formatContentName} from '../../utils/string';
import TouchableOpacity from '../TouchableOpacity/TouchableOpacity';

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
  sharingPost: PostItem | PostEvent;
  clip?: boolean;
  backgroundColor?: string;
  onPress?: () => void;
};

const ExerciseSharingPostCard: React.FC<Props> = ({
  onPress,
  sharingPost,
  clip,
  backgroundColor = COLORS.WHITE,
}) => {
  const exerciseId =
    sharingPost.type === 'post'
      ? sharingPost.payload.exerciseId
      : sharingPost.item.exerciseId;

  const exercise = useExerciseById(exerciseId);

  if (!exercise) return null;

  return (
    <Wrapper onPress={onPress} backgroundColor={backgroundColor}>
      <ExerciseCard
        title={formatContentName(exercise)}
        cardStyle={exercise.card}
        backgroundColor={backgroundColor}
      />
      <SharingPostCard
        sharingPost={sharingPost}
        clip={clip}
        backgroundColor={backgroundColor}
      />
    </Wrapper>
  );
};

export default ExerciseSharingPostCard;
