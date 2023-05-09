import {useCallback} from 'react';
import {
  CompletedSessionPayload,
  UserEvent,
} from '../../../../../shared/src/types/Event';
import useCollections from '../../content/hooks/useCollections';
import useUserState from '../state/state';

const useAddUserEvent = () => {
  const collections = useCollections();
  const addUserEvent = useUserState(state => state.addUserEvent);
  const addCompletedSessionEvent = useUserState(
    state => state.addCompletedSessionEvent,
  );

  return useCallback(
    (type: UserEvent['type'], payload: UserEvent['payload']) => {
      if (type === 'completedSession') {
        const collectionsWithExercise = collections.filter(c =>
          c.exercises.includes((payload as CompletedSessionPayload).exerciseId),
        );

        addCompletedSessionEvent(
          payload as CompletedSessionPayload,
          collectionsWithExercise,
        );
      } else {
        addUserEvent(type, payload);
      }
    },
    [addUserEvent, addCompletedSessionEvent, collections],
  );
};

export default useAddUserEvent;
