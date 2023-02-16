import {useTranslation} from 'react-i18next';
import firebaseStorage from '@react-native-firebase/storage';
import auth, {FirebaseAuthTypes} from '@react-native-firebase/auth';
import {openCamera, openPicker} from 'react-native-image-crop-picker';
import {Alert, PermissionsAndroid, Platform} from 'react-native';
import ActionSheet from 'react-native-action-sheet';
import {useCallback, useState} from 'react';
import {STORAGE_ENDPOINT} from 'config';
import {ensureUserCreated} from '..';

// react-native-image-crop-picker does not export any error
const E_PICKER_CANCELLED = 'E_PICKER_CANCELLED';

const removeProfilePicture = async (user: FirebaseAuthTypes.User | null) => {
  if (!user) {
    return;
  }

  try {
    await firebaseStorage()
      .ref(`users/${user.uid}/profilePicture.jpeg`)
      .delete();

    await user.updateProfile({
      photoURL: Platform.select({ios: '', android: null}), // Setting it to null as per documentation does not delete it on iOS
    });
  } catch (cause: any) {
    if (cause.code === 'storage/object-not-found') {
      return;
    }
    throw new Error('Failed to remove profile picture.', {cause});
  }
};

const uploadProfilePicture = async (
  uri: string | undefined,
  user: FirebaseAuthTypes.User | null,
) => {
  if (!user) {
    return;
  }

  if (!uri) {
    return await removeProfilePicture(user);
  }

  try {
    const {metadata} = await firebaseStorage()
      .ref(`users/${user.uid}/profilePicture.jpeg`)
      // Please note that this does not upload correct mime/content type in iOS simulator
      .putFile(uri);

    const {bucket, fullPath} = metadata;

    await user.updateProfile({
      photoURL: `${STORAGE_ENDPOINT}/${bucket}/${fullPath}?updated=${Date.now()}`,
    });
  } catch (cause) {
    throw new Error('Error occured when updating profile picture.', {cause});
  }
};

const useChangeProfilePicture = () => {
  const {t} = useTranslation('Alert.ChangeProfilePicture');
  const [isUpdatingProfilePicture, setIsUpdatingProfilePicture] =
    useState(false);

  const changeProfilePicture = useCallback(async () => {
    await ensureUserCreated();

    const currentUser = auth().currentUser;

    const optionTitles = [
      t('takePhotoButtonTitle'),
      t('chooseFromLibraryButtonTitle'),
      t('cancelButtonTitle'),
      currentUser?.photoURL ? t('removeButtonTitle') : null,
    ].filter(Boolean) as Array<string>;

    const optionIndex = {
      CAMERA: 0,
      LIBRARY: 1,
      CANCEL: 2,
      REMOVE: 3,
    };

    const imagePickerOptions = {
      width: 500,
      height: 500,
      cropping: true,
      useFrontCamera: true,
      forceJpg: true,
    };

    const captureProfilePicture = async () => {
      try {
        const image = await openCamera(imagePickerOptions);
        setIsUpdatingProfilePicture(true);
        await uploadProfilePicture(image.path, currentUser);
        setIsUpdatingProfilePicture(false);
      } catch (error: any) {
        setIsUpdatingProfilePicture(false);
        if (error.code !== E_PICKER_CANCELLED) {
          console.error(
            new Error('Select profile from camera failed:', {
              cause: error,
            }),
          );
        }
      }
    };

    ActionSheet.showActionSheetWithOptions(
      {
        title: t('title'),
        options: optionTitles,
        tintColor: 'blue',
        cancelButtonIndex: optionIndex.CANCEL,
      },
      async buttonIndex => {
        switch (buttonIndex) {
          case optionIndex.CAMERA: {
            if (Platform.OS !== 'android') {
              captureProfilePicture();
            } else {
              const isCameraAvailable = await PermissionsAndroid.check(
                PermissionsAndroid.PERMISSIONS.CAMERA,
              );
              if (isCameraAvailable) {
                captureProfilePicture();
              } else {
                try {
                  const granted = await PermissionsAndroid.request(
                    PermissionsAndroid.PERMISSIONS.CAMERA,
                    {
                      buttonPositive: t('ok'),
                      title: t('alertCameraTitle'),
                      message: t('alertCameraWhy'),
                    },
                  );
                  if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                    captureProfilePicture();
                  } else if (
                    granted === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN
                  ) {
                    Alert.alert(
                      t('alertCameraTitle'),
                      t('alertCameraSettings'),
                    );
                  }
                } catch (err) {
                  console.error(err);
                }
              }
            }
            break;
          }
          case optionIndex.LIBRARY:
            openPicker(imagePickerOptions).then(
              async image => {
                setIsUpdatingProfilePicture(true);
                await uploadProfilePicture(image.path, currentUser);
                setIsUpdatingProfilePicture(false);
              },
              error => {
                setIsUpdatingProfilePicture(false);
                if (error.code !== E_PICKER_CANCELLED) {
                  console.error(
                    new Error('Select profile from library failed:', {
                      cause: error,
                    }),
                  );
                }
              },
            );
            break;
          case optionIndex.REMOVE: {
            setIsUpdatingProfilePicture(true);
            await removeProfilePicture(currentUser);
            setIsUpdatingProfilePicture(false);
            break;
          }
          default:
            break;
        }
      },
    );
  }, [t, setIsUpdatingProfilePicture]);

  return {
    changeProfilePicture,
    isUpdatingProfilePicture,
  };
};

export default useChangeProfilePicture;
