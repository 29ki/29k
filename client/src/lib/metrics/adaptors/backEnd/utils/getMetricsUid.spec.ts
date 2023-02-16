import {FirebaseAuthTypes} from '@react-native-firebase/auth';
import useUserState from '../../../../user/state/state';
import getMetricsUid from './getMetricsUid';
import {generateId} from '../../../../utils/id';

jest.mock('../../../../utils/id');

afterEach(() => {
  jest.clearAllMocks();
});

describe('getMetricsUid', () => {
  it('fetches the current metricsUid from user state', () => {
    useUserState.setState({
      user: {uid: 'some-user-id'} as FirebaseAuthTypes.User,
      userState: {
        'some-user-id': {
          metricsUid: 'some-metrics-uid',
        },
      },
    });

    expect(getMetricsUid()).toBe('some-metrics-uid');
  });

  it('generates a new if no metricsUid is set', () => {
    jest.mocked(generateId).mockReturnValueOnce('some-uuid');
    useUserState.setState({
      user: {uid: 'some-user-id'} as FirebaseAuthTypes.User,
      userState: {},
    });

    expect(getMetricsUid()).toBe('some-uuid');
    expect(useUserState.getState().userState).toEqual({
      'some-user-id': {
        metricsUid: 'some-uuid',
      },
    });
  });

  it('returns undefined if no current user is set', () => {
    useUserState.setState({
      user: null,
      userState: {},
    });

    expect(getMetricsUid()).toBe(undefined);
  });
});
