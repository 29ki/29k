import {TEMPLE_ENDPOINT} from 'config';
import {Temple} from '../../../../../shared/src/types/Temple';

export const fetchTemples = async (): Promise<Temple[]> => {
  try {
    return (await fetch(TEMPLE_ENDPOINT)).json();
  } catch (cause) {
    throw new Error('Could not fetch temples', {cause});
  }
};
