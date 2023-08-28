import {useNavigation} from '@react-navigation/native';
import {FirebaseAuthTypes} from '@react-native-firebase/auth';
import {act, renderHook} from '@testing-library/react-hooks';

import useDailyState from '../../daily/state/state';
import useHandleLeaveLiveSession from './useHandleLeaveLiveSession';
import {LiveSessionType} from '../../../../../shared/src/schemas/Session';
import useUserState from '../../user/state/state';

jest.mock('../../daily/DailyProvider', () => ({
  DailyContext: jest.fn(),
}));

const mockedLeaveSession = jest.fn();
jest.mock('./useLeaveSession', () =>
  jest.fn(() => ({
    leaveSession: mockedLeaveSession,
  })),
);

const mockedLeaveMeeting = jest.fn();
const mockedShowError = jest.fn();
jest.mock('react', () => ({
  ...jest.requireActual('react'),
  useContext: jest.fn(() => ({
    leaveMeeting: mockedLeaveMeeting,
    showError: mockedShowError,
  })),
}));

afterEach(() => {
  jest.clearAllMocks();
});

describe('useHandleLeaveLiveSession', () => {
  const navigation = useNavigation();
  const mockedNavigate = jest.mocked(navigation.navigate);

  const useTestHook = () => {
    const hasFailed = useDailyState(state => state.hasFailed);
    useHandleLeaveLiveSession({id: 'session-id'} as LiveSessionType);

    return {hasFailed};
  };

  it('should should leave meeting if ejected', async () => {
    useDailyState.setState({
      isEjected: true,
    });
    useUserState.setState({
      user: {uid: 'some-user-id'} as FirebaseAuthTypes.User,
    });
    mockedLeaveSession.mockResolvedValueOnce({});

    await act(async () => {
      const {waitForNextUpdate} = renderHook(useTestHook);
      await waitForNextUpdate();

      expect(mockedLeaveSession).toHaveBeenCalledTimes(1);
      expect(mockedNavigate).toHaveBeenCalledTimes(1);
      expect(mockedNavigate).toHaveBeenCalledWith('SessionEjectionModal');
    });
  });

  it('should should show error banner on error', async () => {
    useDailyState.setState({
      hasFailed: true,
      isEjected: false,
    });

    await act(async () => {
      const {waitForNextUpdate} = renderHook(useTestHook);
      await waitForNextUpdate();

      expect(mockedShowError).toHaveBeenCalledTimes(1);
      expect(mockedShowError).toHaveBeenCalledWith(
        expect.any(String),
        expect.any(String),
        {
          disableAutoClose: true,
          actionConfig: {
            text: expect.any(String),
            action: expect.any(Function),
          },
        },
      );
    });
  });
});
