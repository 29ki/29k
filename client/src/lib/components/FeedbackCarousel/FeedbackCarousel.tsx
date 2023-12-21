import React, {useCallback} from 'react';
import {FlatList} from 'react-native-gesture-handler';
import {Dimensions, ListRenderItem} from 'react-native';
import styled from 'styled-components/native';

import {Feedback} from '../../../../../shared/src/types/Feedback';

import {SPACINGS} from '../../constants/spacings';
import FeedbackPostCard from '../PostCard/FeedbackPostCard';
import {COLORS} from '../../../../../shared/src/constants/colors';
import {Spacer16} from '../Spacers/Spacer';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {
  AppStackProps,
  ModalStackProps,
} from '../../navigation/constants/routes';

const CARD_SIZE = Dimensions.get('screen').width / 2;

const CardWrapper = styled.View({
  width: CARD_SIZE,
  aspectRatio: '1',
});

const FeedbackCarousel: React.FC<{feedbackItems: Feedback[]}> = ({
  feedbackItems,
}) => {
  const {navigate} =
    useNavigation<NativeStackNavigationProp<AppStackProps & ModalStackProps>>();

  const renderItem = useCallback<ListRenderItem<Feedback>>(
    ({item}) => (
      <CardWrapper>
        <FeedbackPostCard
          feedbackPost={item}
          clip
          backgroundColor={COLORS.PURE_WHITE}
          onPress={() => {
            navigate('FeedbackPostModal', {
              feedbackPost: item,
            });
          }}
        />
      </CardWrapper>
    ),
    [navigate],
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
