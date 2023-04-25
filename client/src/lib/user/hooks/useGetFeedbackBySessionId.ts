import {last} from 'ramda';
import {useCallback} from 'react';
import useUserEvents from './useUserEvents';

const useGetFeedbackBySessionId = () => {
  const {feedbackEvents} = useUserEvents();

  const getFeedbackBySessionId = useCallback(
    (sessionId: string) =>
      last(
        feedbackEvents.filter(({payload}) => payload.sessionId === sessionId),
      ),
    [feedbackEvents],
  );

  return getFeedbackBySessionId;
};

export default useGetFeedbackBySessionId;
