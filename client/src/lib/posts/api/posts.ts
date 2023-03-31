import {Post} from '../../../../../shared/src/types/Post';
import apiClient from '../../apiClient/apiClient';

const POSTS_ENDPOINT = '/posts';

export const fetchPosts = async (
  exerciseId: string,
  sharingId: string,
): Promise<Post[]> => {
  try {
    const endpont = `${POSTS_ENDPOINT}/${exerciseId}/${sharingId}`;
    const response = await apiClient(endpont);
    if (!response.ok) {
      throw new Error(await response.text());
    }

    return response.json();
  } catch (cause) {
    throw new Error('Could not fetch posts', {cause});
  }
};

export const addPost = async (
  exerciseId: string,
  sharingId: string,
  text: string,
  anonymous: boolean,
) => {
  try {
    const response = await apiClient(POSTS_ENDPOINT, {
      method: 'post',
      body: JSON.stringify({exerciseId, sharingId, text, anonymous}),
    });
    if (!response.ok) {
      throw new Error(await response.text());
    }
  } catch (cause) {
    throw new Error('Could not add post', {cause});
  }
};
