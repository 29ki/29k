import {useCallback} from 'react';
import {Feedback} from '../../../../../shared/src/types/Feedback';
import * as metrics from '../../metrics';

import useUserEvents from '../../user/hooks/useUserEvents';
import useUserState from '../../user/state/state';

const useSessionFeedback = () => {
  const addUserEvent = useUserState(state => state.addUserEvent);
  const {feedbackEvents} = useUserEvents();

  const addSessionFeedback = useCallback(
    (feedback: Feedback) => {
      addUserEvent('feedback', {
        answer: feedback.answer,
        comment: feedback.comment,
        exerciseId: feedback.exerciseId,
        sessionId: feedback.sessionId,
      });
      metrics.logFeedback({
        exerciseId: feedback.exerciseId,
        sessionId: feedback.sessionId,
        completed: feedback.completed,
        question: feedback.question,
        answer: feedback.answer,
        comment: feedback.comment,
        host: feedback.host,
      });
    },
    [addUserEvent],
  );

  const getFeedbackForSession = useCallback(
    (sessionId: string) => {
      return feedbackEvents.find(
        event => event.payload.sessionId === sessionId,
      );
    },
    [feedbackEvents],
  );

  const getFeedbacksForExercise = useCallback(
    (exerciseId: string) => {
      return feedbackEvents
        .filter(event => event.payload.exerciseId === exerciseId)
        .sort(
          (a, b) =>
            new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime(),
        );
    },
    [feedbackEvents],
  );

  return {
    getFeedbackForSession,
    getFeedbacksForExercise,
    addSessionFeedback,
  };
};

export default useSessionFeedback;
