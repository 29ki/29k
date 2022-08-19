import {API_ENDPOINT} from 'config';
import {Temple} from '../../../../../shared/src/types/Temple';

const TEMPLES_ENDPOINT = `${API_ENDPOINT}/temples`;

export const fetchTemples = async (): Promise<Temple[]> => {
  try {
    return (await fetch(TEMPLES_ENDPOINT)).json();
  } catch (cause) {
    throw new Error('Could not fetch temples', {cause});
  }
};
