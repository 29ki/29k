import React, {useCallback} from 'react';
import {Dimensions, FlatList, ListRenderItem} from 'react-native';
import styled from 'styled-components/native';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {Spacer16} from '../../../../lib/components/Spacers/Spacer';
import {SPACINGS} from '../../../../lib/constants/spacings';
import {ModalStackProps} from '../../../../lib/navigation/constants/routes';
import Gutters from '../../../../lib/components/Gutters/Gutters';
import {Feedback} from '../../../../../../shared/src/types/Feedback';
import ExerciseFeedbackCard from '../../../../lib/components/PostCard/ExerciseFeedbackCard';

const SCREEN_DIMENSIONS = Dimensions.get('screen');
const CARD_WIDTH = SCREEN_DIMENSIONS.width * 0.6;
const CARD_HEIGHT = SCREEN_DIMENSIONS.height / 3;

const FeedbackWrapper = styled.View({
  width: CARD_WIDTH,
  height: CARD_HEIGHT,
});

const FeedbackCard: React.FC<{feedbackPost: Feedback}> = ({feedbackPost}) => {
  const {navigate} =
    useNavigation<NativeStackNavigationProp<ModalStackProps>>();

  const onPress = useCallback(() => {
    navigate('FeedbackPostModal', {
      feedbackPost,
    });
  }, [navigate, feedbackPost]);

  return (
    <FeedbackWrapper>
      <ExerciseFeedbackCard
        feedbackPost={feedbackPost}
        onPress={onPress}
        clip
      />
    </FeedbackWrapper>
  );
};

const renderSharingPost: ListRenderItem<Feedback> = ({item}) => (
  <FeedbackCard feedbackPost={item} />
);

type Props = {
  feedback: Feedback[];
};
const HostFeedback: React.FC<Props> = ({feedback}) =>
  feedback.length === 1 ? (
    <Gutters>
      <FeedbackCard feedbackPost={feedback[0]} />
    </Gutters>
  ) : (
    <FlatList
      renderItem={renderSharingPost}
      horizontal
      data={feedback}
      ListHeaderComponent={Spacer16}
      ItemSeparatorComponent={Spacer16}
      ListFooterComponent={Spacer16}
      snapToAlignment="center"
      decelerationRate="fast"
      snapToInterval={CARD_WIDTH + SPACINGS.SIXTEEN}
      showsHorizontalScrollIndicator={false}
    />
  );

export default HostFeedback;
