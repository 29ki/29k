import {useCallback} from 'react';
import {getDeviceInfo} from '../../utils/system';
import useApiClient from '../../apiClient/hooks/useApiClient';

const REPORT_ENDPOINT = '/report';

const useReportApi = () => {
  const apiClient = useApiClient();

  const submitReport = useCallback(
    async (report: {
      text: string;
      email?: string;
      screen: string;
    }): Promise<void> => {
      const deviceInfo = getDeviceInfo();

      try {
        await apiClient(
          REPORT_ENDPOINT,
          {
            method: 'POST',
            body: JSON.stringify({
              ...report,
              params: {screen: report.screen, ...deviceInfo},
            }),
          },
          undefined,
          true,
          false,
        );
      } catch (cause) {
        throw new Error('Could not submit report', {cause});
      }
    },
    [apiClient],
  );

  return {
    submitReport,
  };
};

export default useReportApi;
