import React, {useCallback} from 'react';
import {FlatList} from 'react-native-gesture-handler';
import {ListRenderItem} from 'react-native';
import styled from 'styled-components/native';

import {Feedback} from '../../../../../shared/src/types/Feedback';

import {SPACINGS} from '../../constants/spacings';
import FeedbackPostCard from '../PostCard/FeedbackPostCard';
import {COLORS} from '../../../../../shared/src/constants/colors';
import {Spacer16} from '../Spacers/Spacer';

const CARD_SIZE = 216;

const CardWrapper = styled.View({
  height: CARD_SIZE,
  width: CARD_SIZE,
});

const FeedbackCarousel: React.FC<{feedbackItems: Feedback[]}> = ({
  feedbackItems,
}) => {
  const renderItem = useCallback<ListRenderItem<Feedback>>(
    ({item}) => (
      <CardWrapper>
        <FeedbackPostCard
          feedbackPost={item}
          clip
          backgroundColor={COLORS.PURE_WHITE}
        />
      </CardWrapper>
    ),
    [],
  );

  return (
    <FlatList
      renderItem={renderItem}
      horizontal
      data={feedbackItems}
      snapToAlignment="center"
      decelerationRate="fast"
      ListHeaderComponent={Spacer16}
      ListFooterComponent={Spacer16}
      ItemSeparatorComponent={Spacer16}
      snapToInterval={CARD_SIZE + SPACINGS.SIXTEEN}
      showsHorizontalScrollIndicator={false}
    />
  );
};

export default FeedbackCarousel;
