import {
  LiveSessionType,
  SessionStateType,
} from '../../../../../shared/src/schemas/Session';
import apiClient from '../../apiClient/apiClient';
import Sentry from '../../sentry';

const SESSIONS_ENDPOINT = '/sessions';

export const addSession = async ({
  exerciseId,
  type,
  startTime,
  language,
}: {
  exerciseId: LiveSessionType['exerciseId'];
  type: LiveSessionType['type'];
  startTime: LiveSessionType['startTime'];
  language: LiveSessionType['language'];
}): Promise<LiveSessionType> => {
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
  data: Partial<Pick<LiveSessionType, 'startTime'>>,
): Promise<LiveSessionType> => {
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
  id: LiveSessionType['id'],
): Promise<LiveSessionType> => {
  const response = await apiClient(`${SESSIONS_ENDPOINT}/${id}`, {
    method: 'GET',
  });

  if (!response.ok) {
    throw new Error(await response.text());
  }

  return response.json();
};

export const getSessionToken = async (
  id: LiveSessionType['id'],
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
  inviteCode: LiveSessionType['inviteCode'],
): Promise<LiveSessionType> => {
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
  data: Partial<SessionStateType>,
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

export const getSessionByHostingCode = async (
  code: LiveSessionType['hostingCode'],
): Promise<LiveSessionType> => {
  const response = await apiClient(`${SESSIONS_ENDPOINT}/hostingCode/${code}`, {
    method: 'GET',
  });

  if (!response.ok) {
    throw new Error(await response.text());
  }

  return response.json();
};

export const getSessionHostingLink = async (
  sessionId: LiveSessionType['id'],
): Promise<string> => {
  const response = await apiClient(
    `${SESSIONS_ENDPOINT}/${sessionId}/hostingLink`,
    {
      method: 'PUT',
    },
  );

  if (!response.ok) {
    throw new Error(await response.text());
  }

  return response.text();
};
