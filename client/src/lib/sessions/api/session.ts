import {isNil, reject} from 'ramda';
import {
  LiveSessionType,
  SessionMode,
  SessionStateType,
} from '../../../../../shared/src/schemas/Session';
import apiClient from '../../apiClient/apiClient';
import Sentry from '../../sentry';
import {Feedback} from '../../../../../shared/src/types/Feedback';

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

export const removeMyself = async (
  sessionId: LiveSessionType['id'],
): Promise<void> => {
  const response = await apiClient(
    `${SESSIONS_ENDPOINT}/${sessionId}/removeMyself`,
    {
      method: 'PUT',
    },
  );

  if (!response.ok) {
    throw new Error(await response.text());
  }
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
  code: number,
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

export const acceptHostingInvite = async (
  sessionId: LiveSessionType['id'],
  hostingCode: number,
): Promise<LiveSessionType> => {
  const response = await apiClient(
    `${SESSIONS_ENDPOINT}/${sessionId}/acceptHostingInvite`,
    {
      method: 'PUT',
      body: JSON.stringify({
        hostingCode,
      }),
    },
  );

  if (!response.ok) {
    throw new Error(await response.text());
  }

  return response.json();
};

export const getFeedbackCountByExercise = async (
  exerciseId: string,
  mode?: SessionMode,
): Promise<{positive: number; negative: number}> => {
  const queryParams = new URLSearchParams(reject(isNil, {mode}));
  const response = await apiClient(
    `${SESSIONS_ENDPOINT}/exercises/${exerciseId}/rating?${queryParams}`,
    {
      method: 'GET',
    },
  );

  if (!response.ok) {
    throw new Error(await response.text());
  }

  return response.json();
};

export const getFeedbackByExercise = async (
  exerciseId: string,
  mode?: SessionMode,
): Promise<Feedback[]> => {
  const queryParams = new URLSearchParams(reject(isNil, {mode}));
  const response = await apiClient(
    `${SESSIONS_ENDPOINT}/exercises/${exerciseId}/feedback?${queryParams}`,
    {
      method: 'GET',
    },
  );

  if (!response.ok) {
    throw new Error(await response.text());
  }

  return response.json();
};
