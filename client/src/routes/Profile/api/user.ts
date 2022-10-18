import apiClient from '../../../lib/apiClient/apiClient';

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
): Promise<void> => {
  try {
    const response = await apiClient(`${USER_ENDPOINT}/verify`, {
      method: 'PUT',
      body: JSON.stringify({verificationCode}),
    });

    if (!response.ok) {
      throw new Error(await response.text());
    }

    return;
  } catch (cause) {
    throw new Error('Could not promote user', {cause});
  }
};
