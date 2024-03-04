import {useCallback, useState} from 'react';
import {fetchPosts} from '../api/posts';
import {PostItem} from '../types/PostItem';
import useGetExerciseById from '../../content/hooks/useGetExerciseById';

const useSharingPosts = () => {
  const getExerciseById = useGetExerciseById();
  const [sharingPosts, setSharingPosts] = useState<PostItem[]>([]);

  const filterPosts = useCallback(
    (posts: PostItem[]) =>
      posts.filter(({item: {exerciseId}}) => getExerciseById(exerciseId)),
    [getExerciseById],
  );

  const fetchSharingPosts = useCallback(async () => {
    const posts = await fetchPosts(20);
    setSharingPosts(
      filterPosts(
        posts.map<PostItem>(post => ({
          type: 'text',
          item: post,
        })),
      ),
    );
  }, [filterPosts]);

  return {
    sharingPosts,
    fetchSharingPosts,
  };
};

export default useSharingPosts;
