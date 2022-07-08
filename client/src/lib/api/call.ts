import {CALL_ENDPOINT} from 'config';

export const getCallUrl = async () => {
  try {
    const response = await fetch(CALL_ENDPOINT);
    return response.text();
  } catch (cause) {
    throw new Error('Could not fetch call url', {cause});
  }
};
