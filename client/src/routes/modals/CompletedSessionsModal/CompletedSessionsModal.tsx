import {RouteProp, useRoute} from '@react-navigation/native';
import React, {useCallback, useMemo, useState} from 'react';
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
import {
  SessionMode,
  SessionType,
} from '../../../../../shared/src/types/Session';

const Row = styled(Gutters)({
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
});

const CompletedSessionsModal = () => {
  const {
    params: {filterSetting},
  } = useRoute<RouteProp<ModalStackProps, 'CompletedSessionsModal'>>();
  const {t} = useTranslation('Modal.CompletedSessions');
  const {completedSessions} = useCompletedSessions();
  const {feedbackEvents} = useUserEvents();
  const [selectedMode, setSelectedMode] = useState<
    SessionMode.async | SessionType.public | SessionType.private
  >();
  const [selectedFeedback, setSelectedFeedback] = useState<boolean>();

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
        .filter(({payload}) =>
          selectedFeedback !== undefined
            ? payload.answer === selectedFeedback
            : true,
        )
        .map(feedbackEvent =>
          completedSessions.find(
            completedSessionEvent =>
              completedSessionEvent.payload.id ===
              feedbackEvent.payload.sessionId,
          ),
        )
        .filter(Boolean) as CompletedSessionEvent[];
    }

    if (filterSetting === 'mode') {
      return completedSessions.filter(({payload}) => {
        if (selectedMode) {
          if (selectedMode === SessionMode.async) {
            return payload.mode === selectedMode;
          } else {
            return payload.type === selectedMode;
          }
        } else {
          return true;
        }
      });
    }

    return completedSessions;
  }, [
    completedSessions,
    filterSetting,
    feedbackEvents,
    selectedFeedback,
    selectedMode,
  ]);

  const Footer = useMemo(
    () => (
      <>
        <Spacer32 />
        {filterSetting === 'feedback' && (
          <Row>
            <FilterStatus
              selected={selectedFeedback === true}
              Icon={ThumbsUpWithoutPadding}
              onPress={() =>
                setSelectedFeedback(selectedFeedback ? undefined : true)
              }
              heading={`${positiveFeedbacks.length}`}
              description={t('meaninful')}
            />
            <Spacer16 />
            <FilterStatus
              selected={selectedFeedback === false}
              Icon={ThumbsDownWithoutPadding}
              onPress={() =>
                setSelectedFeedback(
                  selectedFeedback === false ? undefined : false,
                )
              }
              heading={`${negativeFeedbacks.length}`}
              description={t('notMeaninful')}
            />
          </Row>
        )}

        {filterSetting === 'mode' && (
          <Row>
            <FilterStatus
              Icon={MeIcon}
              selected={selectedMode === SessionMode.async}
              onPress={() =>
                setSelectedMode(
                  selectedMode !== SessionMode.async
                    ? SessionMode.async
                    : undefined,
                )
              }
              heading={`${asyncSessions?.length}`}
              description={t('async')}
            />
            <Spacer16 />
            {privateSessions?.length && (
              <FilterStatus
                Icon={FriendsIcon}
                selected={selectedMode === SessionType.private}
                onPress={() =>
                  setSelectedMode(
                    selectedMode !== SessionType.private
                      ? SessionType.private
                      : undefined,
                  )
                }
                heading={`${privateSessions?.length}`}
                description={t('private')}
              />
            )}
            <Spacer16 />
            {publicSessions?.length && (
              <FilterStatus
                Icon={CommunityIcon}
                selected={selectedMode === SessionType.public}
                onPress={() =>
                  setSelectedMode(
                    selectedMode !== SessionType.public
                      ? SessionType.public
                      : undefined,
                  )
                }
                heading={`${publicSessions?.length}`}
                description={t('public')}
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
      selectedMode,
      selectedFeedback,
      t,
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
