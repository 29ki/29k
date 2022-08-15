import auth from '@react-native-firebase/auth';

export const useSignOutUser = () => {
  const signOut = () => auth().signOut();
  const deleteUser = () => auth().currentUser?.delete();

  return {signOut, deleteUser};
};
