import {useMemo} from 'react';
import {
  CompletedSessionEvent,
  FeedbackEvent,
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

  return useMemo(
    () => ({
      postEvents,
      feedbackEvents,
      completedSessionEvents,
    }),
    [postEvents, feedbackEvents, completedSessionEvents],
  );
};

export default useUserEvents;
