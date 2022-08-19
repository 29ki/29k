import {API_ENDPOINT} from 'config';
import {Temple} from '../../../../../shared/src/types/Temple';

const TEMPLES_ENDPOINT = `${API_ENDPOINT}/temples`;

export const addTemple = async (name: string): Promise<Temple> => {
  try {
    const response = await fetch(TEMPLES_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({name}),
    });
    const {temple} = await response.json();
    return temple;
  } catch (cause) {
    throw new Error('Could not create a room', {cause});
  }
};
