import React, {useCallback, useState} from 'react';
import {useTranslation} from 'react-i18next';
import styled from 'styled-components/native';
import auth from '@react-native-firebase/auth';

import {BottomSheetActionTextInput} from '../../../lib/components/ActionList/ActionItems/ActionTextInput';
import ActionList from '../../../lib/components/ActionList/ActionList';
import Button from '../../../lib/components/Buttons/Button';

import Gutters from '../../../lib/components/Gutters/Gutters';
import SheetModal from '../../../lib/components/Modals/SheetModal';
import {
  Spacer16,
  Spacer24,
  Spacer32,
} from '../../../lib/components/Spacers/Spacer';
import {ModalHeading} from '../../../lib/components/Typography/Heading/Heading';
import ProfilePicture from '../../../lib/components/User/ProfilePicture';
import useUser from '../../../lib/user/hooks/useUser';
import useChangeProfilePicture from '../../../lib/user/hooks/useChangeProfilePicture';
import {useIsFocused, useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {ModalStackProps} from '../../../lib/navigation/constants/routes';
import {Body16} from '../../../lib/components/Typography/Body/Body';
import {COLORS} from '../../../../../shared/src/constants/colors';
import useUpdateProfileDetails from '../../../lib/user/hooks/useUpdateProfileDetails';
import {BottomSheetScrollView} from '@gorhom/bottom-sheet';
import useDeleteUser from '../../../lib/user/hooks/useDeleteUser';
import ActionButton from '../../../lib/components/ActionList/ActionItems/ActionButton';
import ActionSwitch from '../../../lib/components/ActionList/ActionItems/ActionSwitch';
import {
  HangUpIcon,
  LanguagesIcon,
  BellIcon,
  DeleteIcon,
} from '../../../lib/components/Icons';
import useReminderNotificationsSetting from '../../../lib/notifications/hooks/useReminderNotificationsSetting';
import useSignOutUser from '../../../lib/user/hooks/useSignOutUser';
import {SPACINGS} from '../../../lib/constants/spacings';
import useUserState from '../../../lib/user/state/state';

const Picture = styled(ProfilePicture)({
  width: 144,
  alignSelf: 'center',
});

const StyledButton = styled(Button)({
  alignSelf: 'flex-start',
});

const DescriptionInput = styled(BottomSheetActionTextInput).attrs({
  multiline: true,
  numberOfLines: 2,
})({
  maxHeight: SPACINGS.NINTYSIX,
  minHeight: SPACINGS.NINTYSIX,
});

const Error = styled(Body16)({
  color: COLORS.ERROR,
});

const ProfileSettingsModal = () => {
  const {t} = useTranslation('Modal.ProfileSettings');
  const {popToTop, navigate} =
    useNavigation<NativeStackNavigationProp<ModalStackProps>>();
  const {changeProfilePicture, isUpdatingProfilePicture} =
    useChangeProfilePicture();
  const {updateProfileDetails, isUpdatingProfileDetails} =
    useUpdateProfileDetails();
  const {deleteUser} = useDeleteUser();
  const signOut = useSignOutUser();
  const user = useUser();
  const userData = useUserState(state => state.data);
  const {remindersEnabled, setRemindersEnabled} =
    useReminderNotificationsSetting();

  const [displayName, setDisplayName] = useState(user?.displayName);
  const [email, setEmail] = useState(user?.email);
  const [password, setPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [description, setDescription] = useState(userData?.description);
  const [error, setError] = useState('');

  const updateUserPress = useCallback(async () => {
    try {
      await updateProfileDetails({
        displayName,
        email,
        password,
        newPassword,
        description,
      });
      popToTop();
    } catch (e: any) {
      setError(e.code ?? e.message);
    }
  }, [
    updateProfileDetails,
    popToTop,
    displayName,
    email,
    password,
    newPassword,
    description,
  ]);

  const languagePress = useCallback(
    () => navigate('ChangeLanguageModal'),
    [navigate],
  );

  const signInPress = useCallback(() => navigate('SignInModal'), [navigate]);

  const signOutPress = useCallback(async () => {
    try {
      const result = await signOut();
      if (result) {
        popToTop();
      }
    } catch (e: any) {
      setError(e.code ?? e.message);
    }
  }, [signOut, popToTop]);

  const deleteDataPress = useCallback(async () => {
    try {
      if (auth().currentUser?.isAnonymous) {
        await deleteUser();
        popToTop();
      } else {
        navigate('DeleteUserModal');
      }
    } catch (e: any) {
      setError(e.code ?? e.message);
    }
  }, [navigate, popToTop, deleteUser]);

  return (
    <SheetModal>
      <BottomSheetScrollView focusHook={useIsFocused}>
        <Gutters>
          <ModalHeading>{t('title')}</ModalHeading>
          <Spacer24 />
          <Picture
            pictureURL={user?.photoURL}
            letter={user?.displayName?.[0]}
            loading={isUpdatingProfilePicture}
            onPress={changeProfilePicture}
          />
          <Spacer24 />
          <ActionList>
            <BottomSheetActionTextInput
              textContentType="nickname"
              keyboardType="default"
              onSubmitEditing={updateUserPress}
              placeholder={t('displayName')}
              onChangeText={setDisplayName}
              defaultValue={displayName}
            />
            <BottomSheetActionTextInput
              textContentType="emailAddress"
              keyboardType="email-address"
              autoCapitalize="none"
              autoComplete="email"
              autoCorrect={false}
              onSubmitEditing={updateUserPress}
              placeholder={t('email')}
              onChangeText={setEmail}
              defaultValue={email}
            />
            {user && !user?.isAnonymous && (
              <BottomSheetActionTextInput
                textContentType="password"
                secureTextEntry
                autoCapitalize="none"
                autoComplete="password"
                autoCorrect={false}
                onSubmitEditing={updateUserPress}
                placeholder={t('currentPassword')}
                onChangeText={setPassword}
              />
            )}
            <BottomSheetActionTextInput
              textContentType="newPassword"
              secureTextEntry
              autoCapitalize="none"
              autoCorrect={false}
              onSubmitEditing={updateUserPress}
              placeholder={
                user?.isAnonymous === false
                  ? t('changePassword')
                  : t('setPassword')
              }
              onChangeText={setNewPassword}
            />
            <DescriptionInput
              autoCapitalize="none"
              keyboardType="default"
              placeholder={
                'Add a desctiption that will be shown when you host a session'
              }
              onChangeText={setDescription}
              defaultValue={description}
            />
          </ActionList>
          <Spacer16 />
          {error && (
            <>
              <Error>{t(`errors.${error}`)}</Error>
              <Spacer16 />
            </>
          )}
          <StyledButton
            variant="primary"
            onPress={updateUserPress}
            disabled={isUpdatingProfileDetails}
            loading={isUpdatingProfileDetails}>
            {t('save')}
          </StyledButton>
          <Spacer32 />

          <ActionList>
            {(!user || user?.isAnonymous) && (
              <ActionButton Icon={HangUpIcon} onPress={signInPress}>
                {t('actions.signIn')}
              </ActionButton>
            )}
            {user && (
              <>
                <ActionButton Icon={LanguagesIcon} onPress={languagePress}>
                  {t('actions.language')}
                </ActionButton>
                <ActionSwitch
                  Icon={BellIcon}
                  onValueChange={setRemindersEnabled}
                  value={remindersEnabled}>
                  {t('actions.notifications')}
                </ActionSwitch>
              </>
            )}
          </ActionList>
          {user && !user?.isAnonymous && (
            <>
              <Spacer16 />

              <ActionList>
                <ActionButton Icon={HangUpIcon} onPress={signOutPress}>
                  {t('actions.signOut')}
                </ActionButton>
              </ActionList>
            </>
          )}
          {user && (
            <>
              <Spacer16 />
              <ActionList>
                <ActionButton Icon={DeleteIcon} onPress={deleteDataPress}>
                  {t('actions.deleteData')}
                </ActionButton>
              </ActionList>
            </>
          )}
        </Gutters>
      </BottomSheetScrollView>
    </SheetModal>
  );
};

export default ProfileSettingsModal;
