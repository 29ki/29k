import {useCallback, useEffect, useMemo} from 'react';
import {PostType} from '../../../../../shared/src/schemas/Post';
import useCurrentUserState from '../../user/hooks/useCurrentUserState';
import useUserState from '../../user/state/state';
import apiClient from '../../apiClient/apiClient';
import useRelatesState from '../state/state';

const useTogglePostRelate = (post: PostType) => {
  const relatesCount = useRelatesState(state => state.relatesCount[post.id]);
  const setInitialRelatesCount = useRelatesState(
    state => state.setInitialRelatesCount,
  );
  const increaseRelatesCount = useRelatesState(
    state => state.increaseRelatesCount,
  );
  const decreaseRelatesCount = useRelatesState(
    state => state.decreaseRelatesCount,
  );

  const userState = useCurrentUserState();
  const setCurrentUserState = useUserState(state => state.setCurrentUserState);

  useEffect(() => {
    setInitialRelatesCount(post.id, post.relates);
  }, [post, setInitialRelatesCount]);

  const isRelating = useMemo(
    () => (userState?.postRelates ?? []).includes(post.id),
    [userState?.postRelates, post.id],
  );

  const toggleRelate = useCallback(async () => {
    try {
      if (isRelating) {
        setCurrentUserState(({postRelates = []}) => ({
          postRelates: postRelates.filter(id => id !== post.id),
        }));

        decreaseRelatesCount(post.id);

        await apiClient(`/posts/${post.id}/relate`, {method: 'DELETE'});
      } else {
        setCurrentUserState(({postRelates = []}) => ({
          postRelates: [...postRelates, post.id],
        }));

        increaseRelatesCount(post.id);

        await apiClient(`/posts/${post.id}/relate`, {method: 'POST'});
      }
    } catch (cause) {
      console.error('Could not toggle relate', {cause});
    }
  }, [
    setCurrentUserState,
    increaseRelatesCount,
    decreaseRelatesCount,
    post.id,
    isRelating,
  ]);

  return {
    isRelating,
    relatesCount,
    toggleRelate,
  };
};

export default useTogglePostRelate;
