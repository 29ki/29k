import {useCallback} from 'react';
import useAsyncPostMetricEvents from '../../session/hooks/useAsyncPostMetricEvents';

import useSessionState from '../../session/state/state';
import useAddUserEvent from '../../user/hooks/useAddUserEvent';
import useUserEvents from '../../user/hooks/useUserEvents';
import {addPost, fetchExercisePosts} from '../api/posts';
import {ExerciseSlideSharingSlideSharingVideo} from '../../../../../shared/src/types/generated/Exercise';
import {PostItem, VideoPostItem} from '../types/PostItem';

const useSessionSharingPosts = () => {
  const addUserEvent = useAddUserEvent();
  const {postEvents} = useUserEvents();
  const session = useSessionState(state => state.asyncSession);
  const logAsyncPostMetricEvent = useAsyncPostMetricEvents();

  const getSharingPosts = useCallback(
    async (
      sharingId: string,
      sharingVideos: Array<ExerciseSlideSharingSlideSharingVideo> = [],
    ): Promise<Array<PostItem>> => {
      if (session?.exerciseId) {
        const posts = await fetchExercisePosts(
          session.language,
          session.exerciseId,
          sharingId,
        );
        const postItems = sharingVideos.reduce((acc, post, index) => {
          if (post.video?.source) {
            let result: Array<PostItem> = [
              ...acc,
              {
                type: 'video',
                item: {
                  ...post,
                  exerciseId: session.exerciseId,
                  sharingId,
                },
              } as VideoPostItem,
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
    [session?.exerciseId, session?.language],
  );

  const addSharingPost = useCallback(
    async (
      sharingId: string,
      text: string,
      isPublic: boolean,
      isAnonymous: boolean,
    ) => {
      if (session?.id) {
        if (isPublic) {
          await addPost(
            session.language,
            session.exerciseId,
            sharingId,
            text,
            isAnonymous,
          );
        }
        addUserEvent('post', {
          exerciseId: session.exerciseId,
          sessionId: session.id,
          sharingId,
          isPublic,
          isAnonymous: !isPublic ? false : isAnonymous,
          text,
        });
        logAsyncPostMetricEvent('Create Async Post', isPublic, isAnonymous);
      }
    },
    [
      session?.id,
      session?.exerciseId,
      session?.language,
      addUserEvent,
      logAsyncPostMetricEvent,
    ],
  );

  const getSharingPostForSession = useCallback(
    (sessionId: string, sharingId?: string) => {
      return postEvents.find(
        event =>
          event.payload.sessionId === sessionId &&
          (sharingId ? event.payload.sharingId === sharingId : true),
      );
    },
    [postEvents],
  );

  return {
    getSharingPosts,
    getSharingPostForSession,
    addSharingPost,
  };
};

export default useSessionSharingPosts;
