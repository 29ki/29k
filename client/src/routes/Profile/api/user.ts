import apiClient from '../../../lib/apiClient/apiClient';

const USER_ENDPOINT = '/user';

export const promoteUser = async (verificationCode: number): Promise<void> => {
  try {
    const response = await apiClient(`${USER_ENDPOINT}/promote`, {
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
