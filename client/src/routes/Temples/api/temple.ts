import {API_ENDPOINT} from 'config';
import {Temple} from '../../../../../shared/src/types/Temple';
import apiClient from '../../../lib/apiClient/apiClient';

const TEMPLES_ENDPOINT = `${API_ENDPOINT}/temples`;

export const addTemple = async (
  name: string,
  contentId = '095f9642-73b6-4c9a-ae9a-ea7dea7363f5',
): Promise<Temple> => {
  try {
    const response = await apiClient(TEMPLES_ENDPOINT, {
      method: 'POST',
      body: JSON.stringify({name, contentId}),
    });
    const {temple} = await response.json();
    return temple;
  } catch (cause) {
    throw new Error('Could not create a temple', {cause});
  }
};

export const updateTemple = async (id: string, data: Partial<Temple>) => {
  try {
    const response = await apiClient(`${TEMPLES_ENDPOINT}/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });

    return response.json();
  } catch (cause) {
    throw new Error('Could not update temple', {cause});
  }
};
