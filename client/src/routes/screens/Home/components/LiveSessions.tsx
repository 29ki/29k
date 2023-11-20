import React from 'react';
import {Dimensions, FlatList, ListRenderItem} from 'react-native';
import styled from 'styled-components/native';
import {Spacer16} from '../../../../lib/components/Spacers/Spacer';
import {SPACINGS} from '../../../../lib/constants/spacings';
import SessionCard from '../../../../lib/components/Cards/SessionCard/SessionCard';
import {LiveSessionType} from '../../../../../../shared/src/schemas/Session';
import Gutters from '../../../../lib/components/Gutters/Gutters';

const SCREEN_DIMENSIONS = Dimensions.get('screen');
const CARD_WIDTH = SCREEN_DIMENSIONS.width - SPACINGS.SIXTEEN * 4;

const LiveSessionWrapper = styled.View({
  width: CARD_WIDTH,
});

const renderSharingPost: ListRenderItem<LiveSessionType> = ({item}) => (
  <LiveSessionWrapper>
    <SessionCard session={item} />
  </LiveSessionWrapper>
);

type Props = {
  sessions: LiveSessionType[];
};
const LiveSessions: React.FC<Props> = ({sessions}) =>
  sessions.length === 1 ? (
    <Gutters>
      <SessionCard session={sessions[0]} />
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

export default LiveSessions;
