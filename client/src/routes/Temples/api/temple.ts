import {ExerciseState, Temple} from '../../../../../shared/src/types/Temple';
import apiClient from '../../../lib/apiClient/apiClient';

const TEMPLES_ENDPOINT = '/temples';

export const addTemple = async (
  name: string,
  contentId = '095f9642-73b6-4c9a-ae9a-ea7dea7363f5',
): Promise<Temple> => {
  try {
    const response = await apiClient(TEMPLES_ENDPOINT, {
      method: 'POST',
      body: JSON.stringify({name, contentId}),
    });

    if (!response.ok) {
      throw new Error(await response.text());
    }

    return response.json();
  } catch (cause) {
    throw new Error('Could not create a temple', {cause});
  }
};

export const updateTemple = async (
  id: string,
  data: Partial<Pick<Temple, 'started'>>,
) => {
  try {
    const response = await apiClient(`${TEMPLES_ENDPOINT}/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(await response.text());
    }

    return response.json();
  } catch (cause) {
    throw new Error('Could not update temple', {cause});
  }
};

export const updateTempleExerciseState = async (
  id: string,
  data: Partial<ExerciseState>,
) => {
  try {
    const response = await apiClient(
      `${TEMPLES_ENDPOINT}/${id}/exerciseState`,
      {
        method: 'PUT',
        body: JSON.stringify(data),
      },
    );

    if (!response.ok) {
      throw new Error(await response.text());
    }

    return response.json();
  } catch (cause) {
    throw new Error('Could not update temple exercise state', {cause});
  }
};

export const deleteTemple = async (id: string) => {
  try {
    const response = await apiClient(`${TEMPLES_ENDPOINT}/${id}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error(await response.text());
    }

    return response.text();
  } catch (cause) {
    throw new Error('Could not delete temple', {cause});
  }
};
