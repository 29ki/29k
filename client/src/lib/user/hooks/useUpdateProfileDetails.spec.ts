import {clone} from 'ramda';
import {act, renderHook} from '@testing-library/react-hooks';
import auth, {FirebaseAuthTypes} from '@react-native-firebase/auth';
import useUpdateProfileDetails from './useUpdateProfileDetails';

const authOriginalMock = clone(auth());

afterEach(() => {
  jest.clearAllMocks();
  // Reset to orignal mock (restoreAllMocks won't do it)
  jest.mocked(auth).mockReturnValue(clone(authOriginalMock));
});

describe('useUpdateProfileDetails', () => {
  it('creates an anonymous user if no existing user', async () => {
    auth().currentUser = null;

    const {result} = renderHook(() => useUpdateProfileDetails());

    await act(async () => {
      await result.current.updateProfileDetails({
        displayName: 'Some Display Name',
      });
    });

    expect(auth().signInAnonymously).toHaveBeenCalledTimes(1);
  });

  it('updates the users displayName', async () => {
    const {result} = renderHook(() => useUpdateProfileDetails());

    await act(async () => {
      await result.current.updateProfileDetails({
        displayName: 'Some Display Name',
      });
    });

    expect(auth().currentUser?.updateProfile).toHaveBeenCalledTimes(1);
    expect(auth().currentUser?.updateProfile).toHaveBeenCalledWith({
      displayName: 'Some Display Name',
    });

    expect(auth().currentUser?.updateEmail).toHaveBeenCalledTimes(0);
    expect(auth().currentUser?.updatePassword).toHaveBeenCalledTimes(0);
  });

  it('allows setting displayName to empty string', async () => {
    const {result} = renderHook(() => useUpdateProfileDetails());

    await act(async () => {
      await result.current.updateProfileDetails({displayName: ''});
    });

    expect(auth().currentUser?.updateProfile).toHaveBeenCalledTimes(1);
    expect(auth().currentUser?.updateProfile).toHaveBeenCalledWith({
      displayName: '',
    });

    expect(auth().currentUser?.updateEmail).toHaveBeenCalledTimes(0);
    expect(auth().currentUser?.updatePassword).toHaveBeenCalledTimes(0);
  });

  it("only updates displayName if it's changed", async () => {
    (auth().currentUser as FirebaseAuthTypes.User).displayName =
      'Some Display Name';

    const {result} = renderHook(() => useUpdateProfileDetails());

    await act(async () => {
      await result.current.updateProfileDetails({
        displayName: 'Some Display Name',
      });
    });

    expect(auth().currentUser?.updateProfile).toHaveBeenCalledTimes(0);
    expect(auth().currentUser?.updateEmail).toHaveBeenCalledTimes(0);
    expect(auth().currentUser?.updatePassword).toHaveBeenCalledTimes(0);
  });

  describe('isAnonymous = true', () => {
    beforeEach(() => {
      (auth().currentUser as FirebaseAuthTypes.User).isAnonymous = true;
    });

    it('requires both email and password to be set to upgrade to email account', async () => {
      const {result} = renderHook(() => useUpdateProfileDetails());

      await act(async () => {
        await expect(
          async () =>
            await result.current.updateProfileDetails({
              email: 'some@email.address',
            }),
        ).rejects.toThrow('auth/password-missing');
      });

      expect(auth().currentUser?.updateEmail).toHaveBeenCalledTimes(0);
      expect(auth().currentUser?.updateProfile).toHaveBeenCalledTimes(0);
    });
  });

  describe('isAnonymous = false', () => {
    beforeEach(() => {
      (auth().currentUser as FirebaseAuthTypes.User).isAnonymous = false;
      auth().signInWithEmailAndPassword = jest.fn();
      (auth().currentUser as FirebaseAuthTypes.User).email =
        'some@email.address';
    });

    it('signs in with proper email and password to renew token', async () => {
      const {result} = renderHook(() => useUpdateProfileDetails());

      await act(async () => {
        await result.current.updateProfileDetails({
          email: 'some-new@email.address',
          password: '1234',
        });
      });

      expect(auth().signInWithEmailAndPassword).toHaveBeenCalledTimes(1);
      expect(auth().signInWithEmailAndPassword).toHaveBeenCalledWith(
        'some@email.address',
        '1234',
      );
    });

    it('updates the users email after singing in', async () => {
      const {result} = renderHook(() => useUpdateProfileDetails());

      await act(async () => {
        await result.current.updateProfileDetails({
          email: 'some-new@email.address',
          password: '1234',
        });
      });

      expect(auth().signInWithEmailAndPassword).toHaveBeenCalledTimes(1);
      expect(auth().signInWithEmailAndPassword).toHaveBeenCalledWith(
        'some@email.address',
        '1234',
      );
      expect(auth().currentUser?.updateEmail).toHaveBeenCalledTimes(1);
      expect(auth().currentUser?.updateEmail).toHaveBeenCalledWith(
        'some-new@email.address',
      );

      expect(auth().currentUser?.updateProfile).toHaveBeenCalledTimes(0);
      expect(auth().currentUser?.updatePassword).toHaveBeenCalledTimes(0);
    });

    it("only updates email if it's changed", async () => {
      (auth().currentUser as FirebaseAuthTypes.User).isAnonymous = false;

      const {result} = renderHook(() => useUpdateProfileDetails());

      await act(async () => {
        await result.current.updateProfileDetails({
          email: 'some@email.address',
        });
      });

      expect(auth().currentUser?.updateProfile).toHaveBeenCalledTimes(0);
      expect(auth().currentUser?.updateEmail).toHaveBeenCalledTimes(0);
      expect(auth().currentUser?.updatePassword).toHaveBeenCalledTimes(0);
    });

    it('updates the users password', async () => {
      const {result} = renderHook(() => useUpdateProfileDetails());

      await act(async () => {
        await result.current.updateProfileDetails({
          email: 'some@email.address',
          password: 'somepassword',
          newPassword: 'newpassword',
        });
      });

      expect(auth().currentUser?.updatePassword).toHaveBeenCalledTimes(1);
      expect(auth().currentUser?.updatePassword).toHaveBeenCalledWith(
        'newpassword',
      );

      expect(auth().currentUser?.updateEmail).toHaveBeenCalledTimes(0);
      expect(auth().currentUser?.updateProfile).toHaveBeenCalledTimes(0);
    });
  });
});
