import React, {useCallback, useState} from 'react';
import {useTranslation} from 'react-i18next';
import styled from 'styled-components/native';
import auth from '@react-native-firebase/auth';

import {BottomSheetActionTextInput} from '../../common/components/ActionList/ActionItems/ActionTextInput';
import ActionList from '../../common/components/ActionList/ActionList';
import Button from '../../common/components/Buttons/Button';

import Gutters from '../../common/components/Gutters/Gutters';
import SheetModal from '../../common/components/Modals/SheetModal';
import {
  Spacer16,
  Spacer24,
  Spacer48,
} from '../../common/components/Spacers/Spacer';
import {ModalHeading} from '../../common/components/Typography/Heading/Heading';
import ProfilePicture from '../../common/components/User/ProfilePicture';
import useUser from '../../lib/user/hooks/useUser';
import useChangeProfilePicture from '../../lib/user/hooks/useChangeProfilePicture';
import {useIsFocused, useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {ModalStackProps} from '../../lib/navigation/constants/routes';
import {Body16} from '../../common/components/Typography/Body/Body';
import {COLORS} from '../../../../shared/src/constants/colors';
import useUpdateProfileDetails from '../../lib/user/hooks/useUpdateProfileDetails';
import {BottomSheetScrollView} from '@gorhom/bottom-sheet';
import useDeleteUser from '../../lib/user/hooks/useDeleteUser';

const Picture = styled(ProfilePicture)({
  width: 144,
  alignSelf: 'center',
});

const StyledButton = styled(Button)({
  alignSelf: 'flex-start',
});

const DeleteButton = styled(StyledButton)({
  backgroundColor: COLORS.ERROR,
});

const Error = styled(Body16)({
  color: COLORS.ERROR,
});

const ProfileSettingsModal = () => {
  const {t} = useTranslation('Modal.ProfileSettings');
  const {popToTop} =
    useNavigation<NativeStackNavigationProp<ModalStackProps>>();
  const changeProfilePicture = useChangeProfilePicture();
  const updateProfileDetails = useUpdateProfileDetails();
  const deleteUser = useDeleteUser();
  const user = useUser();

  const [displayName, setDisplayName] = useState(user?.displayName);
  const [email, setEmail] = useState(user?.email);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const updateUser = useCallback(async () => {
    try {
      await updateProfileDetails({displayName, email, password});
      popToTop();
    } catch (e: any) {
      setError(e.code ?? e.message);
    }
  }, [updateProfileDetails, popToTop, displayName, email, password]);

  const signOut = useCallback(async () => {
    await auth().signOut();
    popToTop();
  }, [popToTop]);

  const deleteData = useCallback(async () => {
    if (await deleteUser()) {
      popToTop();
    }
  }, [deleteUser, popToTop]);

  return (
    <SheetModal>
      <BottomSheetScrollView focusHook={useIsFocused}>
        <Gutters>
          <ModalHeading>{t('title')}</ModalHeading>
          <Spacer24 />
          <Picture
            pictureURL={user?.photoURL}
            letter={user?.displayName?.[0]}
            onPress={changeProfilePicture}
          />
          <Spacer24 />
          <ActionList>
            <BottomSheetActionTextInput
              textContentType="nickname"
              keyboardType="default"
              onSubmitEditing={updateUser}
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
              onSubmitEditing={updateUser}
              placeholder={t('email')}
              onChangeText={setEmail}
              defaultValue={email}
            />
            <BottomSheetActionTextInput
              textContentType="newPassword"
              secureTextEntry
              autoCapitalize="none"
              autoComplete="password-new"
              autoCorrect={false}
              onSubmitEditing={updateUser}
              placeholder={t('password')}
              onChangeText={setPassword}
            />
          </ActionList>
          <Spacer16 />
          {error && (
            <>
              {/* @ts-expect-error variable/string litteral as key is not yet supported https://www.i18next.com/overview/typescript#type-error-template-literal*/}
              <Error>{t(`errors.${error}`)}</Error>
              <Spacer16 />
            </>
          )}
          <StyledButton variant="primary" onPress={updateUser}>
            {t('save')}
          </StyledButton>
          {user && (
            <>
              <Spacer48 />
              {!user?.isAnonymous && (
                <>
                  <StyledButton variant="secondary" onPress={signOut}>
                    {t('signOut')}
                  </StyledButton>
                  <Spacer16 />
                </>
              )}
              <DeleteButton variant="secondary" onPress={deleteData}>
                {t('deleteData')}
              </DeleteButton>
            </>
          )}
        </Gutters>
      </BottomSheetScrollView>
    </SheetModal>
  );
};

export default ProfileSettingsModal;
