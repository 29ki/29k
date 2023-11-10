import {useCallback, useState} from 'react';
import {fetchPosts} from '../api/posts';
import {PostItem} from '../types/PostItem';

const useSharingPosts = () => {
  const [sharingPosts, setSharingPosts] = useState<PostItem[]>([]);

  const fetchSharingPosts = useCallback(async () => {
    const posts = await fetchPosts(20);
    setSharingPosts(
      posts.map<PostItem>(post => ({
        type: 'text',
        item: post,
      })),
    );
  }, []);

  return {
    sharingPosts,
    fetchSharingPosts,
  };
};

export default useSharingPosts;
