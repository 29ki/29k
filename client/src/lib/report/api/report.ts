import apiClient from '../../apiClient/apiClient';

const REPORT_ENDPOINT = '/report';

export const submitReport = async (report: {
  text: string;
  email?: string;
}): Promise<void> => {
  try {
    const response = await apiClient(`${REPORT_ENDPOINT}/`, {
      method: 'POST',
      body: JSON.stringify(report),
    });

    if (!response.ok) {
      throw new Error(await response.text());
    }

    return;
  } catch (cause) {
    throw new Error('Could not submit report', {cause});
  }
};
