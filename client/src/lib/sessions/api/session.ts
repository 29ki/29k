import {Session, SessionState} from '../../../../../shared/src/types/Session';
import apiClient from '../../../lib/apiClient/apiClient';

const SESSIONS_ENDPOINT = '/sessions';

export const addSession = async ({
  contentId,
  type,
  startTime,
  language,
}: {
  contentId: Session['contentId'];
  type: Session['type'];
  startTime: Session['startTime'];
  language: Session['language'];
}): Promise<Session> => {
  try {
    const response = await apiClient(SESSIONS_ENDPOINT, {
      method: 'POST',
      body: JSON.stringify({contentId, type, startTime, language}),
    });

    if (!response.ok) {
      throw new Error(await response.text());
    }

    return response.json();
  } catch (cause) {
    throw new Error('Could not create a session', {cause});
  }
};

export const updateSession = async (
  id: string,
  data: Partial<Pick<Session, 'startTime' | 'type'>>,
): Promise<Session> => {
  try {
    const response = await apiClient(`${SESSIONS_ENDPOINT}/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(await response.text());
    }

    return response.json();
  } catch (cause) {
    throw new Error('Could not update session', {cause});
  }
};

export const getSessionToken = async (id: Session['id']): Promise<string> => {
  const response = await apiClient(`${SESSIONS_ENDPOINT}/${id}/sessionToken`, {
    method: 'GET',
  });

  if (!response.ok) {
    throw new Error(await response.text());
  }

  return response.text();
};

export const joinSession = async (
  inviteCode: Session['inviteCode'],
): Promise<Session> => {
  const response = await apiClient(`${SESSIONS_ENDPOINT}/joinSession`, {
    method: 'PUT',
    body: JSON.stringify({inviteCode}),
  });

  if (!response.ok) {
    throw new Error(await response.text());
  }

  return response.json();
};

export const updateSessionState = async (
  id: string,
  data: Partial<SessionState>,
) => {
  try {
    const response = await apiClient(`${SESSIONS_ENDPOINT}/${id}/state`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(await response.text());
    }

    return response.json();
  } catch (cause) {
    throw new Error('Could not update session exercise state', {cause});
  }
};

export const deleteSession = async (id: string) => {
  try {
    const response = await apiClient(`${SESSIONS_ENDPOINT}/${id}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error(await response.text());
    }

    return response.text();
  } catch (cause) {
    throw new Error('Could not delete session', {cause});
  }
};
