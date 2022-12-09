import React, {useCallback, useState} from 'react';
import {useTranslation} from 'react-i18next';
import auth from '@react-native-firebase/auth';
import styled from 'styled-components/native';
import {BottomSheetActionTextInput} from '../../common/components/ActionList/ActionItems/ActionTextInput';
import ActionList from '../../common/components/ActionList/ActionList';
import Button from '../../common/components/Buttons/Button';

import Gutters from '../../common/components/Gutters/Gutters';
import SheetModal from '../../common/components/Modals/SheetModal';
import {Spacer16, Spacer24} from '../../common/components/Spacers/Spacer';
import {ModalHeading} from '../../common/components/Typography/Heading/Heading';
import ProfilePicture from '../../common/components/User/ProfilePicture';
import useUser from '../../lib/user/hooks/useUser';
import useChangeProfilePicture from '../../lib/user/hooks/useChangeProfilePicture';
import {Alert} from 'react-native';
import useUpdateProfileDetails from '../../lib/user/hooks/useUpdateProfileDetails';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {ModalStackProps} from '../../lib/navigation/constants/routes';

const Picture = styled(ProfilePicture)({
  width: 144,
  alignSelf: 'center',
});

const StyledButton = styled(Button)({
  alignSelf: 'flex-start',
});

const ProfileSettingsModal = () => {
  const {t} = useTranslation('Modal.ProfileSettings');
  const {popToTop} =
    useNavigation<NativeStackNavigationProp<ModalStackProps>>();
  const changeProfilePicture = useChangeProfilePicture();
  const updateProfileDetails = useUpdateProfileDetails();
  const user = useUser();

  const [displayName, setDisplayName] = useState(user?.displayName);
  const [email, setEmail] = useState(user?.email);
  const [password, setPassword] = useState();

  const updateUser = useCallback(async () => {
    try {
      await updateProfileDetails({displayName, email, password});
      popToTop();
    } catch (e: any) {
      Alert.alert(e.message);
    }
  }, [updateProfileDetails, popToTop, displayName, email, password]);

  return (
    <SheetModal>
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
        <StyledButton variant="primary" onPress={updateUser}>
          {t('save')}
        </StyledButton>
      </Gutters>
    </SheetModal>
  );
};

export default ProfileSettingsModal;
