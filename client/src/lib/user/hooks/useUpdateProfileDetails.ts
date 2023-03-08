import {useCallback, useState} from 'react';
import auth, {FirebaseAuthTypes} from '@react-native-firebase/auth';
import {ensureUserCreated} from '..';

export type ProfileDetails = {
  displayName?: FirebaseAuthTypes.User['displayName'];
  email?: FirebaseAuthTypes.User['email'];
  password?: string;
  newPassword?: string;
};

export type UpdateProfileDetails = (
  profileDetails: ProfileDetails,
) => Promise<void>;

const useUpdateProfileDetails = () => {
  const [isUpdatingProfileDetails, setIsUpdatingProfileDetails] =
    useState(false);

  const updateProfileDetails = useCallback<UpdateProfileDetails>(
    async ({displayName, email, password, newPassword}) => {
      try {
        setIsUpdatingProfileDetails(true);

        await ensureUserCreated();

        const currentUser = auth().currentUser;

        if (currentUser?.isAnonymous && email) {
          if (!newPassword) {
            throw new Error('auth/password-missing');
          }
          const emailAndPasswordCredentials = auth.EmailAuthProvider.credential(
            email,
            newPassword,
          );
          await currentUser?.linkWithCredential(emailAndPasswordCredentials);

          // We get auth/id-token-revoked if not signIn again
          await auth().signInWithCredential(emailAndPasswordCredentials);
        } else {
          const emailChanged = email && email !== currentUser?.email;

          if (emailChanged || newPassword) {
            if (!password) {
              throw new Error('auth/current-password-missing');
            }
            if (!currentUser?.email || !email) {
              throw new Error('auth/invalid-email');
            }

            await auth().signInWithEmailAndPassword(
              currentUser.email,
              password,
            );

            if (email !== currentUser.email) {
              await currentUser.updateEmail(email);
            }
            if (newPassword) {
              await currentUser.updatePassword(newPassword);
            }
          }
        }

        if (
          typeof displayName === 'string' &&
          displayName !== currentUser?.displayName
        ) {
          await currentUser?.updateProfile({displayName});
        }

        setIsUpdatingProfileDetails(false);
      } catch (e: any) {
        setIsUpdatingProfileDetails(false);
        throw e;
      }
    },
    [setIsUpdatingProfileDetails],
  );

  return {
    updateProfileDetails,
    isUpdatingProfileDetails,
  };
};

export default useUpdateProfileDetails;
