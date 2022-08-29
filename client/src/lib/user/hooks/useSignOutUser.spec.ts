import {renderHook} from '@testing-library/react-hooks';
import auth from '@react-native-firebase/auth';
import {useSignOutUser} from './useSignOutUser';

describe('useSignOutUser', () => {
  describe('signOut', () => {
    it('signs out the user', () => {
      const {result} = renderHook(useSignOutUser);

      result.current.signOut();

      expect(auth().signOut).toHaveBeenCalledTimes(1);
    });
  });

  describe('deleteUser', () => {
    it('deletes the user', () => {
      const {result} = renderHook(useSignOutUser);

      result.current.deleteUser();

      expect(auth().currentUser?.delete).toHaveBeenCalledTimes(1);
    });
  });
});
