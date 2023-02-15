import {useCallback} from 'react';
import {Feedback} from '../../../../../shared/src/types/Feedback';
import * as metrics from '../../metrics';

import useEvents from '../../user/hooks/useEvents';
import useUserState from '../../user/state/state';

const useSessionFeedback = () => {
  const addEvent = useUserState(state => state.addEvent);
  const {feedbackEvents} = useEvents();

  const addSessionFeedback = useCallback(
    (feedback: Feedback) => {
      if (feedback.sessionId) {
        addEvent({
          type: 'feedback',
          payload: {
            answer: feedback.answer,
            comment: feedback.comment,
            exerciseId: feedback.exerciseId,
            sessionId: feedback.sessionId,
          },
        });
      }
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
    [addEvent],
  );

  const getFeedbacksForSession = useCallback(
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
    getFeedbacksForSession,
    getFeedbacksForExercise,
    addSessionFeedback,
  };
};

export default useSessionFeedback;
