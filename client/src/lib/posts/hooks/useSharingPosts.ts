import {useCallback} from 'react';

import useSessionState from '../../session/state/state';
import useUserState, {getPostEventsSelector} from '../../user/state/state';
import {addPost, fetchPosts} from '../api/posts';

const useSharingPosts = (exerciseId?: string) => {
  const addEvent = useUserState(state => state.addEvent);
  const events = useUserState(state => getPostEventsSelector(state));
  const session = useSessionState(state => state.asyncSession);

  const getSharingPosts = useCallback(async () => {
    if (exerciseId) {
      return fetchPosts(exerciseId);
    }
    return [];
  }, [exerciseId]);

  const addSharingPost = useCallback(
    async (
      sharingId: string,
      text: string,
      isPublic: boolean,
      isAnonymous: boolean,
    ) => {
      if (exerciseId && session?.id) {
        if (isPublic) {
          await addPost(exerciseId, sharingId, text, isAnonymous);
        }
        addEvent({
          type: 'post',
          payload: {
            exerciseId,
            sessionId: session.id,
            sharingId,
            isPublic,
            isAnonymous,
            text,
          },
        });
      }
    },
    [exerciseId, session?.id, addEvent],
  );

  const getSharingPostForSession = useCallback(
    (sessionId: string, sharingId: string) => {
      return events.find(
        event =>
          event.payload.exerciseId === exerciseId &&
          event.payload.sessionId === sessionId &&
          event.payload.sharingId === sharingId,
      );
    },
    [events, exerciseId],
  );

  const getSharingPostsForExercise = useCallback(
    (sharingId: string) => {
      return events
        .filter(
          event =>
            event.payload.exerciseId === exerciseId &&
            event.payload.sharingId === sharingId,
        )
        .sort(
          (a, b) =>
            new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime(),
        );
    },
    [events, exerciseId],
  );

  return {
    getSharingPosts,
    getSharingPostForSession,
    getSharingPostsForExercise,
    addSharingPost,
  };
};

export default useSharingPosts;
