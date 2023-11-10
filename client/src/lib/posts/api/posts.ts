import {PostType} from '../../../../../shared/src/schemas/Post';
import apiClient from '../../apiClient/apiClient';

const POSTS_ENDPOINT = '/posts';

export const fetchPosts = async (limit: number): Promise<PostType[]> => {
  try {
    const query = new URLSearchParams({limit: limit.toString()});

    const response = await apiClient(`${POSTS_ENDPOINT}?${query}`);
    if (!response.ok) {
      throw new Error(await response.text());
    }

    return response.json();
  } catch (cause) {
    throw new Error('Could not fetch posts', {cause});
  }
};

export const fetchExercisePosts = async (
  exerciseId: string,
  sharingId: string,
): Promise<PostType[]> => {
  try {
    const response = await apiClient(
      `${POSTS_ENDPOINT}/${exerciseId}/${sharingId}`,
    );
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
