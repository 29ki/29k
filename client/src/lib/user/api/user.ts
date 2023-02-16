import {VerificationError} from '../../../../../shared/src/errors/User';
import {UserProfile} from '../../../../../shared/src/types/User';
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

export const getProfile = async (userId: string): Promise<UserProfile> => {
  try {
    const response = await apiClient(`${USER_ENDPOINT}/${userId}`, {
      method: 'GET',
    });

    if (!response.ok) {
      throw new Error(await response.text());
    }

    return response.json();
  } catch (cause) {
    throw new Error('Could get user profile', {cause});
  }
};
