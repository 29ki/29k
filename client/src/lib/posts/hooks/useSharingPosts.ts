import {useCallback} from 'react';
import useSessionState from '../../session/state/state';
import useUserState, {
  getCurrentUserStateSelector,
  PostPayload,
} from '../../user/state/state';
import {addPost, fetchPosts} from '../api/posts';

const useSharingPosts = (exerciseId?: string) => {
  const addEvent = useUserState(state => state.addEvent);
  const events = useUserState(
    state => getCurrentUserStateSelector(state)?.events,
  );
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
          timestamp: new Date(),
        });
      }
    },
    [exerciseId, session?.id, addEvent],
  );

  const getSharingPostForSessionId = useCallback(
    (sessionId: string, sharingId: string) => {
      return events
        ?.filter(event => event.type === 'post')
        .find(event => {
          const payload = event.payload as PostPayload;
          return (
            payload.exerciseId === exerciseId &&
            payload.sessionId === sessionId &&
            payload.sharingId === sharingId
          );
        })?.payload as PostPayload | undefined;
    },
    [events, exerciseId],
  );

  return {getSharingPosts, getSharingPostForSessionId, addSharingPost};
};

export default useSharingPosts;
