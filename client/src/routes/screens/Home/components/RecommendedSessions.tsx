import React from 'react';
import {Dimensions, FlatList, ListRenderItem} from 'react-native';
import styled from 'styled-components/native';
import {Spacer16} from '../../../../lib/components/Spacers/Spacer';
import {SPACINGS} from '../../../../lib/constants/spacings';
import SessionCard from '../../../../lib/components/Cards/SessionCard/SessionCard';
import {LiveSessionType} from '../../../../../../shared/src/schemas/Session';
import {Exercise} from '../../../../../../shared/src/types/generated/Exercise';
import Gutters from '../../../../lib/components/Gutters/Gutters';
import ExerciseCard from '../../../../lib/components/Cards/SessionCard/ExerciseCard';

const SCREEN_DIMENSIONS = Dimensions.get('screen');
const CARD_WIDTH = SCREEN_DIMENSIONS.width - SPACINGS.SIXTEEN * 4;

const RecommendationWrapper = styled.View({
  width: CARD_WIDTH,
});

const renderSharingPost: ListRenderItem<LiveSessionType | Exercise> = ({
  item,
}) => (
  <RecommendationWrapper>
    <Recommentation item={item} />
  </RecommendationWrapper>
);

const Recommentation: React.FC<{item: LiveSessionType | Exercise}> = ({
  item,
}) =>
  'mode' in item ? (
    <SessionCard session={item} small />
  ) : (
    <ExerciseCard exercise={item} />
  );

type Props = {
  sessions: (LiveSessionType | Exercise)[];
};
const RecommendedSessions: React.FC<Props> = ({sessions}) =>
  sessions.length === 1 ? (
    <Gutters>
      <Recommentation item={sessions[0]} />
    </Gutters>
  ) : (
    <FlatList
      renderItem={renderSharingPost}
      horizontal
      data={sessions}
      ListHeaderComponent={Spacer16}
      ItemSeparatorComponent={Spacer16}
      ListFooterComponent={Spacer16}
      snapToAlignment="start"
      snapToInterval={CARD_WIDTH}
      decelerationRate="fast"
      showsHorizontalScrollIndicator={false}
    />
  );

export default RecommendedSessions;
