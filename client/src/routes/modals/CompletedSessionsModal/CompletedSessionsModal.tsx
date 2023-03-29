import {RouteProp, useRoute} from '@react-navigation/native';
import React, {useCallback, useMemo} from 'react';
import {useTranslation} from 'react-i18next';
import {ListRenderItem} from 'react-native';
import {BottomSheetScrollView} from '@gorhom/bottom-sheet';

import {BottomSheetFlatList} from '@gorhom/bottom-sheet';

import Gutters from '../../../lib/components/Gutters/Gutters';

import SheetModal from '../../../lib/components/Modals/SheetModal';

import {ModalStackProps} from '../../../lib/navigation/constants/routes';

import {CompletedSessionEvent} from '../../../../../shared/src/types/Event';
import useCompletedSessions from '../../../lib/sessions/hooks/useCompletedSessions';

import JourneyNode from '../../screens/Journey/components/JourneyNode';
import useUserEvents from '../../../lib/user/hooks/useUserEvents';
import styled from 'styled-components/native';
import Button from '../../../lib/components/Buttons/Button';

const Row = styled(Gutters)({
  flexDirection: 'row',
  alignItems: 'center',
});

const CompletedSessionsModal = () => {
  const {
    params: {filterSetting},
  } = useRoute<RouteProp<ModalStackProps, 'CompletedSessionsModal'>>();
  const {t} = useTranslation('Modal.CompletedSessions');
  const {completedSessions} = useCompletedSessions();
  const {feedbackEvents} = useUserEvents();

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

  return (
    <SheetModal>
      <BottomSheetScrollView>
        <BottomSheetFlatList data={data} renderItem={renderItem} />

        <Row>
          <Button onPress={() => {}}>{'Positive'}</Button>
          <Button onPress={() => {}}>{'Negative'}</Button>
        </Row>
      </BottomSheetScrollView>
    </SheetModal>
  );
};

export default CompletedSessionsModal;
