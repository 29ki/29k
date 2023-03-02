import {CompletedSessionsCount} from '../../../../../shared/src/types/CompletedSessions';
import apiClient from '../../apiClient/apiClient';

const SESSIONS_COUNT_ENDPOINT = '/sessionsCount';

export const fetchCompletedSessionsCount = async (): Promise<
  Array<CompletedSessionsCount>
> => {
  try {
    const response = await apiClient(SESSIONS_COUNT_ENDPOINT);
    if (!response.ok) {
      throw new Error(await response.text());
    }

    return response.json();
  } catch (cause) {
    console.log(cause);

    throw new Error('Could not fetch completed sessions count', {cause});
  }
};
