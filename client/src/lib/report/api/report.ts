import apiClient from '../../apiClient/apiClient';
import {getCurrentRouteName} from '../../navigation/utils/routes';
import {getDeviceInfo} from '../../utils/system';

const REPORT_ENDPOINT = '/report';

export const submitReport = async (report: {
  text: string;
  email?: string;
}): Promise<void> => {
  const screen = getCurrentRouteName();
  const deviceInfo = getDeviceInfo();

  try {
    const response = await apiClient(`${REPORT_ENDPOINT}/`, {
      method: 'POST',
      body: JSON.stringify({...report, params: {screen, ...deviceInfo}}),
    });

    if (!response.ok) {
      throw new Error(await response.text());
    }

    return;
  } catch (cause) {
    throw new Error('Could not submit report', {cause});
  }
};
