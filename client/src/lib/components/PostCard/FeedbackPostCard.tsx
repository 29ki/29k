import React from 'react';
import {FeedbackEvent} from '../../../../../shared/src/types/Event';
import {Body16} from '../Typography/Body/Body';
import PostCard from './PostCard';
import {Spacer16, Spacer8} from '../Spacers/Spacer';
import styled from 'styled-components/native';
import {COLORS} from '../../../../../shared/src/constants/colors';
import {Feedback} from '../../../../../shared/src/types/Feedback';
import {SPACINGS} from '../../constants/spacings';
import {
  ThumbsDownWithoutPadding,
  ThumbsUpWithoutPadding,
} from '../Thumbs/Thumbs';
import Badge from '../Badge/Badge';
import dayjs from 'dayjs';

const Header = styled.View({
  flexDirection: 'row',
  alignItems: 'center',
});

const ThumbWrapper = styled.View({
  width: SPACINGS.TWENTYFOUR,
  height: SPACINGS.TWENTYFOUR,
});

type Props = {
  feedbackPost: FeedbackEvent | Feedback;
  clip?: boolean;
  backgroundColor?: string;
  onPress?: () => void;
};

const FeedbackPostCard: React.FC<Props> = ({
  feedbackPost,
  clip = false,
  backgroundColor = COLORS.WHITE,
  onPress,
}) => {
  const feedback =
    'payload' in feedbackPost ? feedbackPost.payload : feedbackPost;

  const timestamp =
    'timestamp' in feedbackPost
      ? feedbackPost.timestamp
      : feedbackPost.createdAt;

  return (
    <PostCard onPress={onPress} backgroundColor={backgroundColor} clip={clip}>
      <Header>
        <ThumbWrapper>
          {feedback.answer ? (
            <ThumbsUpWithoutPadding />
          ) : (
            <ThumbsDownWithoutPadding />
          )}
        </ThumbWrapper>

        <Spacer8 />
        <Badge text={dayjs(timestamp).format('d MMM, YYYY')} />
      </Header>
      <Spacer16 />
      <Body16>{feedback.comment}</Body16>
    </PostCard>
  );
};

export default FeedbackPostCard;
