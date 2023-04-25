import {useCallback} from 'react';
import useUserEvents from './useUserEvents';
import useCompletedSessions from '../../sessions/hooks/useCompletedSessions';
import {CompletedSessionEvent} from '../../../../../shared/src/types/Event';

const useGetSessionsByFeedback = () => {
  const {feedbackEvents} = useUserEvents();
  const {completedSessions} = useCompletedSessions();

  const getSessionsByFeedback = useCallback(
    (feedbackAnswer?: boolean) =>
      feedbackEvents
        .filter(({payload}) =>
          feedbackAnswer !== undefined
            ? payload.answer === feedbackAnswer
            : true,
        )
        .map(feedbackEvent =>
          completedSessions.find(
            completedSessionEvent =>
              completedSessionEvent.payload.id ===
              feedbackEvent.payload.sessionId,
          ),
        )
        .filter(Boolean) as CompletedSessionEvent[],
    [feedbackEvents, completedSessions],
  );

  return getSessionsByFeedback;
};

export default useGetSessionsByFeedback;
