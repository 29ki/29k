import {
  LiveSession,
  SessionState,
} from '../../../../../shared/src/types/Session';
import apiClient from '../../apiClient/apiClient';
import Sentry from '../../sentry';

const SESSIONS_ENDPOINT = '/sessions';

export const addSession = async ({
  exerciseId,
  type,
  startTime,
  language,
}: {
  exerciseId: LiveSession['exerciseId'];
  type: LiveSession['type'];
  startTime: LiveSession['startTime'];
  language: LiveSession['language'];
}): Promise<LiveSession> => {
  try {
    const response = await apiClient(SESSIONS_ENDPOINT, {
      method: 'POST',
      body: JSON.stringify({exerciseId, type, startTime, language}),
    });

    if (!response.ok) {
      throw new Error(await response.text());
    }

    return response.json();
  } catch (cause) {
    throw new Error('Could not create a session', {cause});
  }
};

export const updateInterestedCount = async (id: string, increment: boolean) => {
  try {
    const response = await apiClient(
      `${SESSIONS_ENDPOINT}/${id}/interestedCount`,
      {
        method: 'PUT',
        body: JSON.stringify({increment}),
      },
    );

    if (!response.ok) {
      Sentry.captureMessage(await response.text(), 'error');
    }
  } catch (cause) {
    Sentry.captureException(
      new Error('Could not update interested count on session', {cause}),
    );
  }
};

export const updateSession = async (
  id: string,
  data: Partial<Pick<LiveSession, 'startTime' | 'type'>>,
): Promise<LiveSession> => {
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

export const getSession = async (
  id: LiveSession['id'],
): Promise<LiveSession> => {
  const response = await apiClient(`${SESSIONS_ENDPOINT}/${id}`, {
    method: 'GET',
  });

  if (!response.ok) {
    throw new Error(await response.text());
  }

  return response.json();
};

export const getSessionToken = async (
  id: LiveSession['id'],
): Promise<string> => {
  const response = await apiClient(`${SESSIONS_ENDPOINT}/${id}/sessionToken`, {
    method: 'GET',
  });

  if (!response.ok) {
    throw new Error(await response.text());
  }

  return response.text();
};

export const joinSession = async (
  inviteCode: LiveSession['inviteCode'],
): Promise<LiveSession> => {
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
