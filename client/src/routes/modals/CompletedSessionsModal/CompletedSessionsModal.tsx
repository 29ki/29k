import {RouteProp, useRoute} from '@react-navigation/native';
import React, {useCallback, useMemo, useState} from 'react';
import {ListRenderItem} from 'react-native';
import {BottomSheetFlatList} from '@gorhom/bottom-sheet';

import Gutters from '../../../lib/components/Gutters/Gutters';

import SheetModal from '../../../lib/components/Modals/SheetModal';

import {ModalStackProps} from '../../../lib/navigation/constants/routes';

import {CompletedSessionEvent} from '../../../../../shared/src/types/Event';
import useCompletedSessions from '../../../lib/sessions/hooks/useCompletedSessions';

import JourneyNode from '../../screens/Journey/components/JourneyNode';

import {Spacer12} from '../../../lib/components/Spacers/Spacer';

import {
  SessionMode,
  SessionType,
} from '../../../../../shared/src/types/Session';
import useGetSessionsByFeedback from './hooks/useGetSessionsByFeedback';
import FeedbackFilters from './components/FeedbackFilters';
import ModeFilters from './components/ModeFilters';

const CompletedSessionsModal = () => {
  const {
    params: {filterSetting},
  } = useRoute<RouteProp<ModalStackProps, 'CompletedSessionsModal'>>();
  const {completedSessions} = useCompletedSessions();
  const [selectedMode, setSelectedMode] = useState<
    SessionMode.async | SessionType.public | SessionType.private
  >();
  const [selectedFeedback, setSelectedFeedback] = useState<boolean>();
  const getSessionsByFeedback = useGetSessionsByFeedback();

  const renderItem = useCallback<ListRenderItem<CompletedSessionEvent>>(
    ({item, index}) => (
      <Gutters key={item.payload.id}>
        <JourneyNode index={index} completedSessionEvent={item} />
      </Gutters>
    ),
    [],
  );

  const data = useMemo(() => {
    if (filterSetting === 'feedback') {
      return getSessionsByFeedback(selectedFeedback);
    }

    if (filterSetting === 'mode') {
      return completedSessions.filter(({payload}) => {
        if (selectedMode) {
          return selectedMode === SessionMode.async
            ? payload.mode === selectedMode
            : payload.type === selectedMode;
        } else {
          return true;
        }
      });
    }

    return completedSessions;
  }, [
    completedSessions,
    filterSetting,
    selectedFeedback,
    selectedMode,
    getSessionsByFeedback,
  ]);

  const Filters = useMemo(
    () => (
      <>
        <Spacer12 />
        {filterSetting === 'feedback' && (
          <FeedbackFilters
            selectedFeedback={selectedFeedback}
            onChange={setSelectedFeedback}
          />
        )}

        {filterSetting === 'mode' && (
          <ModeFilters selectedMode={selectedMode} onChange={setSelectedMode} />
        )}
        <Spacer12 />
      </>
    ),
    [filterSetting, selectedMode, selectedFeedback],
  );

  return (
    <SheetModal>
      <BottomSheetFlatList
        data={data}
        renderItem={renderItem}
        ListHeaderComponent={data.length > 5 ? Filters : null}
        ListFooterComponent={Filters}
      />
    </SheetModal>
  );
};

export default CompletedSessionsModal;
