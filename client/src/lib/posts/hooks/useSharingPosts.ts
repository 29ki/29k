import {useCallback} from 'react';
import useAsyncPostMetricEvents from '../../session/hooks/useAsyncPostMetricEvents';

import useSessionState from '../../session/state/state';
import useAddUserEvent from '../../user/hooks/useAddUserEvent';
import useUserEvents from '../../user/hooks/useUserEvents';
import {addPost, fetchPosts} from '../api/posts';
import {ExerciseSlideSharingSlideSharingVideos} from '../../../../../shared/src/types/generated/Exercise';
import {PostItem, VideoPostItem} from '../types/PostItem';

const useSharingPosts = (exerciseId?: string) => {
  const addUserEvent = useAddUserEvent();
  const {postEvents} = useUserEvents();
  const session = useSessionState(state => state.asyncSession);
  const logAsyncPostMetricEvent = useAsyncPostMetricEvents();

  const getSharingPosts = useCallback(
    async (
      sharingId: string,
      sharingVideos: Array<ExerciseSlideSharingSlideSharingVideos> = [],
    ): Promise<Array<PostItem>> => {
      if (exerciseId) {
        const posts = await fetchPosts(exerciseId, sharingId);
        const postItems = sharingVideos.reduce((acc, post, index) => {
          if (post.video?.source) {
            let result: Array<PostItem> = [
              ...acc,
              {type: 'video', item: post} as VideoPostItem,
            ];
            if (posts[index]) {
              result.push({type: 'text', item: posts[index]});
            }
            return result;
          }
          return acc;
        }, [] as Array<PostItem>);

        const numberToSkip =
          sharingVideos.length > 0 ? sharingVideos.length : 0;

        return [
          ...postItems,
          ...(posts
            .slice(numberToSkip)
            .map(post => ({type: 'text', item: post})) as Array<PostItem>),
        ];
      }
      return [];
    },
    [exerciseId],
  );

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
        addUserEvent('post', {
          exerciseId,
          sessionId: session.id,
          sharingId,
          isPublic,
          isAnonymous,
          text,
        });
        logAsyncPostMetricEvent('Create Async Post', isPublic, isAnonymous);
      }
    },
    [exerciseId, session?.id, addUserEvent, logAsyncPostMetricEvent],
  );

  const getSharingPostForSession = useCallback(
    (sessionId: string, sharingId?: string) => {
      return postEvents.find(
        event =>
          event.payload.sessionId === sessionId &&
          (exerciseId ? event.payload.exerciseId === exerciseId : true) &&
          (sharingId ? event.payload.sharingId === sharingId : true),
      );
    },
    [postEvents, exerciseId],
  );

  const getSharingPostsForExercise = useCallback(
    (sharingId: string) => {
      return postEvents
        .filter(
          event =>
            event.payload.exerciseId === exerciseId &&
            event.payload.sharingId === sharingId,
        )
        .sort(
          (a, b) =>
            new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
        );
    },
    [postEvents, exerciseId],
  );

  return {
    getSharingPosts,
    getSharingPostForSession,
    getSharingPostsForExercise,
    addSharingPost,
  };
};

export default useSharingPosts;
