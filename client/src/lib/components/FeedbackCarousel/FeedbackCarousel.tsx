import React, {useCallback} from 'react';
import {FlatList} from 'react-native-gesture-handler';
import {ListRenderItem} from 'react-native';
import styled from 'styled-components/native';

import {Feedback} from '../../../../../shared/src/types/Feedback';

import {SPACINGS} from '../../constants/spacings';
import FeedbackCard from '../FeedbackCard/FeedbackCard';

const List = styled(FlatList)({
  flexGrow: 0,
  width: '100%',
}) as unknown as FlatList;

const CARD_WIDTH = 216;

const PaddingWrapper = styled.View<{isLast: boolean}>(({isLast}) => ({
  paddingLeft: SPACINGS.SIXTEEN,
  paddingRight: isLast ? SPACINGS.SIXTEEN : undefined,
}));

const CardWrapper = styled.View({
  width: CARD_WIDTH,
  marginBottom: SPACINGS.SIXTEEN,
});

const FeedbackCarousel: React.FC<{feedbackItems: Feedback[]}> = ({
  feedbackItems,
}) => {
  const keyExtractor = useCallback((item: Feedback) => item.id, []);

  const renderItem = useCallback<ListRenderItem<Feedback>>(
    ({item, index}) => (
      <PaddingWrapper isLast={index === feedbackItems.length - 1}>
        <CardWrapper>
          <FeedbackCard answer={item.answer} date={item.createdAt}>
            {item.comment}
          </FeedbackCard>
        </CardWrapper>
      </PaddingWrapper>
    ),
    [feedbackItems],
  );

  return (
    <List
      renderItem={renderItem}
      keyExtractor={keyExtractor}
      horizontal
      data={feedbackItems}
      snapToAlignment="center"
      decelerationRate="fast"
      snapToInterval={CARD_WIDTH + SPACINGS.SIXTEEN}
      showsHorizontalScrollIndicator={false}
    />
  );
};

export default FeedbackCarousel;
