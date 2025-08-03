import {isNil, reject} from 'ramda';
import {LiveSessionType} from '../../../../../shared/src/schemas/Session';
import apiClient from '../../apiClient/apiClient';
import {Feedback} from '../../../../../shared/src/types/Feedback';

const SESSIONS_ENDPOINT = '/sessions';

export const fetchSessions = async (
  exerciseId?: string,
  hostId?: string,
  limit?: number,
): Promise<LiveSessionType[]> => {
  try {
    const queryParams = new URLSearchParams(
      reject(isNil, {exerciseId, hostId, limit: limit?.toString()}),
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

export const fetchHostFeedback = async (
  limit?: number,
): Promise<Feedback[]> => {
  try {
    const queryParams = new URLSearchParams(
      reject(isNil, {limit: limit?.toString()}),
    );

    const response = await apiClient(
      `${SESSIONS_ENDPOINT}/hostFeedback?${queryParams}`,
    );
    if (!response.ok) {
      throw new Error(await response.text());
    }

    return response.json();
  } catch (cause) {
    console.log(cause);
    throw new Error('Could not fetch host feedback', {cause});
  }
};
