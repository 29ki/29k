import {RouteProp, useRoute} from '@react-navigation/native';
import React, {useCallback, useMemo} from 'react';
import {useTranslation} from 'react-i18next';
import {ListRenderItem} from 'react-native';
import styled from 'styled-components/native';
import {BottomSheetFlatList} from '@gorhom/bottom-sheet';
import {groupBy, partition} from 'ramda';

import Gutters from '../../../lib/components/Gutters/Gutters';

import SheetModal from '../../../lib/components/Modals/SheetModal';

import {ModalStackProps} from '../../../lib/navigation/constants/routes';

import {CompletedSessionEvent} from '../../../../../shared/src/types/Event';
import useCompletedSessions from '../../../lib/sessions/hooks/useCompletedSessions';

import JourneyNode from '../../screens/Journey/components/JourneyNode';
import useUserEvents from '../../../lib/user/hooks/useUserEvents';
import FilterStatus from '../../screens/Journey/components/FilterStatus';
import {
  ThumbsDownWithoutPadding,
  ThumbsUpWithoutPadding,
} from '../SessionFeedbackModal/components/Thumbs';

import {Spacer16, Spacer32} from '../../../lib/components/Spacers/Spacer';
import {
  CommunityIcon,
  FriendsIcon,
  MeIcon,
} from '../../../lib/components/Icons';

const Row = styled(Gutters)({
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
});

const CompletedSessionsModal = () => {
  const {
    params: {filterSetting},
  } = useRoute<RouteProp<ModalStackProps, 'CompletedSessionsModal'>>();
  const {completedSessions} = useCompletedSessions();
  const {feedbackEvents} = useUserEvents();

  const [positiveFeedbacks, negativeFeedbacks] = useMemo(
    () => partition(f => f.payload.answer, feedbackEvents),
    [feedbackEvents],
  );

  const {live: liveSessions, async: asyncSessions} = useMemo(
    () => groupBy(s => s.payload.mode, completedSessions),
    [completedSessions],
  );

  const {private: privateSessions, public: publicSessions} = useMemo(
    () => groupBy(s => s.payload.type, liveSessions ?? []),
    [liveSessions],
  );

  const renderItem = useCallback<ListRenderItem<CompletedSessionEvent>>(
    ({item}) => (
      <Gutters>
        <JourneyNode completedSessionEvent={item} />
      </Gutters>
    ),
    [],
  );

  const data = useMemo(() => {
    if (filterSetting === 'feedback') {
      return feedbackEvents
        .filter(({payload}) => payload.answer)
        .map(feedbackEvent =>
          completedSessions.find(
            completedSessionEvent =>
              completedSessionEvent.payload.id ===
              feedbackEvent.payload.sessionId,
          ),
        )
        .filter(Boolean) as CompletedSessionEvent[];
    }

    return completedSessions;
  }, [completedSessions, filterSetting, feedbackEvents]);

  const Footer = useMemo(
    () => (
      <>
        <Spacer32 />
        {filterSetting === 'feedback' && (
          <Row>
            <FilterStatus
              Icon={ThumbsUpWithoutPadding}
              onPress={() => {}}
              heading={`${positiveFeedbacks.length}`}
              description={'Meaningful\nsessions'}
            />
            <Spacer16 />
            <FilterStatus
              Icon={ThumbsDownWithoutPadding}
              onPress={() => {}}
              heading={`${negativeFeedbacks.length}`}
              description={'Not meaningful\nsessions'}
            />
          </Row>
        )}

        {filterSetting === 'mode' && (
          <Row>
            <FilterStatus
              Icon={MeIcon}
              onPress={() => {}}
              heading={`${asyncSessions?.length}`}
              description={'Just me'}
            />

            {privateSessions?.length && (
              <FilterStatus
                Icon={FriendsIcon}
                onPress={() => {}}
                heading={`${privateSessions?.length}`}
                description={'My friends'}
              />
            )}
            {publicSessions?.length && (
              <FilterStatus
                Icon={CommunityIcon}
                onPress={() => {}}
                heading={`${publicSessions?.length}`}
                description={'Anyone'}
              />
            )}
          </Row>
        )}
        <Spacer32 />
      </>
    ),
    [
      positiveFeedbacks?.length,
      negativeFeedbacks?.length,
      asyncSessions?.length,
      privateSessions?.length,
      publicSessions?.length,
      filterSetting,
    ],
  );

  return (
    <SheetModal>
      <BottomSheetFlatList
        data={data}
        renderItem={renderItem}
        ListFooterComponent={Footer}
      />
    </SheetModal>
  );
};

export default CompletedSessionsModal;
