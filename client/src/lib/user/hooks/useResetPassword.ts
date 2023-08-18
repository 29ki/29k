import {useCallback} from 'react';
import auth from '@react-native-firebase/auth';

const useResetPassword = () => {
  return useCallback(async (email: string) => {
    try {
      await auth().sendPasswordResetEmail(email);
    } catch (e) {
      const error = e as any;
      switch (error.code) {
        case 'auth/network-request-failed':
          return error.code;
        case 'auth/invalid-email':
          return error.code;
        case 'auth/user-not-found':
          // We should not expose that if an email address is not present
          return null;
        default:
          return 'unknown';
      }
    }

    return null;
  }, []);
};

export default useResetPassword;
