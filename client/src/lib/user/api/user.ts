import {VerificationError} from '../../../../../shared/src/errors/User';
import {UserData, User} from '../../../../../shared/src/types/User';
import apiClient from '../../apiClient/apiClient';

const USER_ENDPOINT = '/user';

export const requestPromotion = async (): Promise<void> => {
  try {
    const response = await apiClient(`${USER_ENDPOINT}/requestPublicHost`, {
      method: 'POST',
    });

    if (!response.ok) {
      throw new Error(await response.text());
    }

    return;
  } catch (cause) {
    throw new Error('Could not request promotion user', {cause});
  }
};

export const verifyPromotion = async (
  verificationCode: number,
): Promise<VerificationError | undefined> => {
  try {
    const response = await apiClient(`${USER_ENDPOINT}/verifyPublicHostCode`, {
      method: 'PUT',
      body: JSON.stringify({verificationCode}),
    });

    if (!response.ok) {
      const text = await response.text();
      if (
        Object.values(VerificationError).find(errorCode => errorCode === text)
      ) {
        return text as unknown as VerificationError;
      }
      throw new Error(await response.text());
    }

    return;
  } catch (cause) {
    throw new Error('Could not promote user', {cause});
  }
};

export const getUser = async (userId: string): Promise<User> => {
  try {
    const response = await apiClient(`${USER_ENDPOINT}/${userId}`, {
      method: 'GET',
    });

    if (!response.ok) {
      throw new Error(await response.text());
    }

    return response.json();
  } catch (cause) {
    throw new Error('Could not get user profile', {cause});
  }
};

export const getMe = async (): Promise<UserData> => {
  try {
    const response = await apiClient(USER_ENDPOINT, {
      method: 'GET',
    });

    if (!response.ok) {
      throw new Error(await response.text());
    }

    return response.json();
  } catch (cause) {
    throw new Error('Could not get user profile', {cause});
  }
};

export const getPublicHosts = async (): Promise<Array<User>> => {
  try {
    const response = await apiClient(`${USER_ENDPOINT}/publicHosts`, {
      method: 'GET',
    });

    if (!response.ok) {
      throw new Error(await response.text());
    }

    return response.json();
  } catch (cause) {
    throw new Error('Could not get public hosts', {cause});
  }
};

export const updateUser = async (
  data: Partial<Omit<UserData, 'id' | 'profile'>>,
) => {
  try {
    const response = await apiClient(USER_ENDPOINT, {
      method: 'POST',
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(await response.text());
    }

    return;
  } catch (cause) {
    throw new Error('Could not update user', {cause});
  }
};
