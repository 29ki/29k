import apiClient from '../../apiClient/apiClient';
import {getDeviceInfo} from '../../utils/system';

const REPORT_ENDPOINT = '/report';

export const submitReport = async (report: {
  text: string;
  email?: string;
  screen: string;
}): Promise<void> => {
  const deviceInfo = getDeviceInfo();

  try {
    const response = await apiClient(`${REPORT_ENDPOINT}/`, {
      method: 'POST',
      body: JSON.stringify({
        ...report,
        params: {screen: report.screen, ...deviceInfo},
      }),
    });

    if (!response.ok) {
      throw new Error(await response.text());
    }

    return;
  } catch (cause) {
    throw new Error('Could not submit report', {cause});
  }
};
