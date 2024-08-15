import {useCallback, useState} from 'react';
import {fetchPosts} from '../api/posts';
import {PostItem} from '../types/PostItem';
import useGetExerciseById from '../../content/hooks/useGetExerciseById';

const useSharingPosts = () => {
  const getExerciseById = useGetExerciseById();
  const [sharingPosts, setSharingPosts] = useState<PostItem[]>([]);

  const fetchSharingPosts = useCallback(async () => {
    const posts = await fetchPosts(20);
    setSharingPosts(
      posts
        .map<PostItem>(post => ({
          type: 'text',
          item: post,
        }))
        .filter(({item: {exerciseId}}) => getExerciseById(exerciseId)),
    );
  }, [getExerciseById]);

  return {
    sharingPosts,
    fetchSharingPosts,
  };
};

export default useSharingPosts;
