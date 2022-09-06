import {Temple} from '../../../../../shared/src/types/Temple';
import apiClient from '../../../lib/apiClient/apiClient';

const TEMPLES_ENDPOINT = '/temples';

export const fetchTemples = async (): Promise<Temple[]> => {
  try {
    const response = await apiClient(TEMPLES_ENDPOINT);
    if (!response.ok) {
      throw new Error(await response.text());
    }
    return response.json();
  } catch (cause) {
    throw new Error('Could not fetch temples', {cause});
  }
};
