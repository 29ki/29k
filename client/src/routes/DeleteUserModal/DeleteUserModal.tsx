import React, {useCallback, useState} from 'react';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {useTranslation} from 'react-i18next';
import styled from 'styled-components/native';
import auth from '@react-native-firebase/auth';

import {ModalStackProps} from '../../lib/navigation/constants/routes';
import {COLORS} from '../../../../shared/src/constants/colors';

import useDeleteUser from '../../lib/user/hooks/useDeleteUser';

import ActionList from '../../lib/components/ActionList/ActionList';
import Button from '../../lib/components/Buttons/Button';
import Gutters from '../../lib/components/Gutters/Gutters';
import SheetModal from '../../lib/components/Modals/SheetModal';
import {Spacer16, Spacer24} from '../../lib/components/Spacers/Spacer';
import {ModalHeading} from '../../lib/components/Typography/Heading/Heading';
import {BottomSheetActionTextInput} from '../../lib/components/ActionList/ActionItems/ActionTextInput';
import {Body16} from '../../lib/components/Typography/Body/Body';

const StyledButton = styled(Button)({
  alignSelf: 'flex-start',
});

const Error = styled(Body16)({
  color: COLORS.ERROR,
});

const DeleteUserModal = () => {
  const {t} = useTranslation('Modal.DeleteUser');
  const {popToTop} =
    useNavigation<NativeStackNavigationProp<ModalStackProps>>();

  const [isSigningIn, setIsSigningIn] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const {deleteUser, isDeletingUser} = useDeleteUser();

  const onConfirm = useCallback(async () => {
    try {
      setIsSigningIn(true);
      await auth().signInWithEmailAndPassword(email, password);
      setIsSigningIn(false);
      await deleteUser();
      popToTop();
    } catch (e: any) {
      setIsSigningIn(false);
      setError(e.code ?? e.message);
    }
  }, [setIsSigningIn, popToTop, deleteUser, email, password]);

  return (
    <SheetModal>
      <Gutters>
        <ModalHeading>{t('title')}</ModalHeading>
        <Spacer24 />
        <ActionList>
          <BottomSheetActionTextInput
            textContentType="emailAddress"
            keyboardType="email-address"
            autoCapitalize="none"
            autoComplete="email"
            autoCorrect={false}
            onSubmitEditing={onConfirm}
            placeholder={t('email')}
            onChangeText={setEmail}
            defaultValue={email}
          />
          <BottomSheetActionTextInput
            textContentType="password"
            secureTextEntry
            autoCapitalize="none"
            autoComplete="password"
            autoCorrect={false}
            onSubmitEditing={onConfirm}
            placeholder={t('password')}
            onChangeText={setPassword}
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
          disabled={isSigningIn || isDeletingUser || !email || !password}
          loading={isSigningIn || isDeletingUser}
          onPress={onConfirm}>
          {t('confirm')}
        </StyledButton>
      </Gutters>
    </SheetModal>
  );
};

export default DeleteUserModal;
