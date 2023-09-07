import dayjs from 'dayjs';
import React, {useCallback} from 'react';
import {FlatList} from 'react-native-gesture-handler';
import {ListRenderItem} from 'react-native';
import styled from 'styled-components/native';

import {COLORS} from '../../../../../shared/src/constants/colors';
import {Feedback} from '../../../../../shared/src/types/Feedback';
import SETTINGS from '../../constants/settings';
import {SPACINGS} from '../../constants/spacings';
import {Spacer8} from '../Spacers/Spacer';
import Tag from '../Tag/Tag';
import {
  ThumbsUpWithoutPadding,
  ThumbsDownWithoutPadding,
} from '../Thumbs/Thumbs';
import {Body16} from '../Typography/Body/Body';

const CARD_WIDTH = 216;

const List = styled(FlatList)({
  flexGrow: 0,
  width: '100%',
}) as unknown as FlatList;

const CardWrapper = styled.View<{isLast: boolean}>(({isLast}) => ({
  paddingLeft: SPACINGS.SIXTEEN,
  paddingRight: isLast ? SPACINGS.SIXTEEN : undefined,
}));

const Card = styled.View({
  ...SETTINGS.BOXSHADOW_SMALL,
  backgroundColor: COLORS.WHITE,
  borderRadius: SETTINGS.BORDER_RADIUS.CARDS,
  padding: SPACINGS.SIXTEEN,
  width: CARD_WIDTH,
  minHeight: 120,
  maxHeight: 216,
  marginBottom: SPACINGS.SIXTEEN,
});

const Row = styled.View({
  flexDirection: 'row',
  alignItems: 'center',
});

const DateTag = styled(Tag)({
  marginTop: 0,
  backgroundColor: COLORS.PURE_WHITE,
});

const ThumbWrapper = styled.View({
  width: SPACINGS.TWENTYFOUR,
  height: SPACINGS.TWENTYFOUR,
});

const FeedbackCarousel: React.FC<{feedbackItems: Feedback[]}> = ({
  feedbackItems,
}) => {
  const keyExtractor = useCallback((item: Feedback) => item.id, []);

  const renderItem = useCallback<ListRenderItem<Feedback>>(
    ({item, index}) => (
      <CardWrapper isLast={index === feedbackItems.length - 1}>
        <Card>
          <Row>
            <ThumbWrapper>
              {item.answer ? (
                <ThumbsUpWithoutPadding />
              ) : (
                <ThumbsDownWithoutPadding />
              )}
            </ThumbWrapper>
            <Spacer8 />
            <DateTag>{dayjs(item.createdAt).format('d MMM')}</DateTag>
          </Row>
          <Spacer8 />
          <Body16>{item.comment}</Body16>
        </Card>
      </CardWrapper>
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
