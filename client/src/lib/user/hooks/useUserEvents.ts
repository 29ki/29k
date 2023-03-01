import {useMemo} from 'react';
import {
  CompletedSessionEvent,
  FeedbackEvent,
  OngoingSessionEvent,
  PostEvent,
} from '../../../../../shared/src/types/Event';
import useUserState, {getCurrentUserStateSelector} from '../state/state';

const useUserEvents = () => {
  const events = useUserState(state =>
    getCurrentUserStateSelector(state),
  )?.userEvents;

  const postEvents = useMemo(() => {
    if (events) {
      return events.filter(e => e.type === 'post') as PostEvent[];
    }
    return [];
  }, [events]);

  const feedbackEvents = useMemo(() => {
    if (events) {
      return events.filter(e => e.type === 'feedback') as FeedbackEvent[];
    }
    return [];
  }, [events]);

  const completedSessionEvents = useMemo(() => {
    if (events) {
      return events.filter(
        e => e.type === 'completedSession',
      ) as CompletedSessionEvent[];
    }
    return [];
  }, [events]);

  const ongoingSessionEvents = useMemo(() => {
    if (events) {
      return events.filter(
        e => e.type === 'ongoingSession',
      ) as OngoingSessionEvent[];
    }
    return [];
  }, [events]);

  return useMemo(
    () => ({
      postEvents,
      feedbackEvents,
      completedSessionEvents,
      ongoingSessionEvents,
    }),
    [postEvents, feedbackEvents, completedSessionEvents, ongoingSessionEvents],
  );
};

export default useUserEvents;
