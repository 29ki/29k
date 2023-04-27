import {isNil, reject} from 'ramda';
import {LiveSession} from '../../../../../shared/src/schemas/Session';
import apiClient from '../../apiClient/apiClient';

const SESSIONS_ENDPOINT = '/sessions';

export const fetchSessions = async (
  exerciseId?: string,
  hostId?: string,
): Promise<LiveSession[]> => {
  try {
    const queryParams = new URLSearchParams(
      reject(isNil, {exerciseId, hostId}),
    );

    const response = await apiClient(`${SESSIONS_ENDPOINT}?${queryParams}`);
    if (!response.ok) {
      throw new Error(await response.text());
    }

    return response.json();
  } catch (cause) {
    throw new Error('Could not fetch sessions', {cause});
  }
};
