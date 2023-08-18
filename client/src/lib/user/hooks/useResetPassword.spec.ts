import auth from '@react-native-firebase/auth';
import {renderHook} from '@testing-library/react-hooks';
import useResetPassword from './useResetPassword';

const mockedSendPasswordResetEmail = jest.mocked(auth().sendPasswordResetEmail);

beforeEach(() => {
  jest.clearAllMocks();
});

describe('useResetPassword', () => {
  it('should send reset email', async () => {
    const {result} = renderHook(() => useResetPassword());

    const errorCode = await result.current('test@test.com');

    expect(errorCode).toBe(null);
    expect(mockedSendPasswordResetEmail).toHaveBeenCalledTimes(1);
    expect(mockedSendPasswordResetEmail).toHaveBeenCalledWith('test@test.com');
  });

  it('should return auth/network-request-failed', async () => {
    mockedSendPasswordResetEmail.mockRejectedValueOnce({
      code: 'auth/network-request-failed',
    });
    const {result} = renderHook(() => useResetPassword());

    const errorCode = await result.current('test@test.com');

    expect(errorCode).toEqual('auth/network-request-failed');
    expect(mockedSendPasswordResetEmail).toHaveBeenCalledTimes(1);
    expect(mockedSendPasswordResetEmail).toHaveBeenCalledWith('test@test.com');
  });

  it('should return auth/invalid-email', async () => {
    mockedSendPasswordResetEmail.mockRejectedValueOnce({
      code: 'auth/invalid-email',
    });
    const {result} = renderHook(() => useResetPassword());

    const errorCode = await result.current('test@test.com');

    expect(errorCode).toEqual('auth/invalid-email');
    expect(mockedSendPasswordResetEmail).toHaveBeenCalledTimes(1);
    expect(mockedSendPasswordResetEmail).toHaveBeenCalledWith('test@test.com');
  });

  it('should return unknown on unknown errors', async () => {
    mockedSendPasswordResetEmail.mockRejectedValueOnce({
      code: 'auth/some-unknonwn-error',
    });
    const {result} = renderHook(() => useResetPassword());

    const errorCode = await result.current('test@test.com');

    expect(errorCode).toEqual('unknown');
    expect(mockedSendPasswordResetEmail).toHaveBeenCalledTimes(1);
    expect(mockedSendPasswordResetEmail).toHaveBeenCalledWith('test@test.com');
  });

  it('should return no errors if user was not found', async () => {
    mockedSendPasswordResetEmail.mockRejectedValueOnce({
      code: 'auth/user-not-found',
    });
    const {result} = renderHook(() => useResetPassword());

    const errorCode = await result.current('test@test.com');

    expect(errorCode).toBe(null);
    expect(mockedSendPasswordResetEmail).toHaveBeenCalledTimes(1);
    expect(mockedSendPasswordResetEmail).toHaveBeenCalledWith('test@test.com');
  });
});
