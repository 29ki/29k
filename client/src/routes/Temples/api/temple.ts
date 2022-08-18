import {TEMPLE_ENDPOINT} from 'config';
import {Temple} from '../../../../../shared/src/types/Temple';

export const addTemple = async (name: string): Promise<Temple> => {
  try {
    const response = await fetch(TEMPLE_ENDPOINT, {
      method: 'POST',
      body: JSON.stringify({name}),
    });
    const {temple} = await response.json();
    return temple;
  } catch (cause) {
    throw new Error('Could not create a room', {cause});
  }
};
