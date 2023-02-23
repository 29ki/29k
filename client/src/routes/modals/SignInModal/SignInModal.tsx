import React, {useCallback, useState} from 'react';
import {useTranslation} from 'react-i18next';
import styled from 'styled-components/native';
import auth from '@react-native-firebase/auth';

import {BottomSheetActionTextInput} from '../../../lib/components/ActionList/ActionItems/ActionTextInput';
import ActionList from '../../../lib/components/ActionList/ActionList';
import Button from '../../../lib/components/Buttons/Button';

import Gutters from '../../../lib/components/Gutters/Gutters';
import SheetModal from '../../../lib/components/Modals/SheetModal';
import {Spacer16, Spacer24} from '../../../lib/components/Spacers/Spacer';
import {ModalHeading} from '../../../lib/components/Typography/Heading/Heading';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {ModalStackProps} from '../../../lib/navigation/constants/routes';
import {Body16} from '../../../lib/components/Typography/Body/Body';
import {COLORS} from '../../../../../shared/src/constants/colors';

const StyledButton = styled(Button)({
  alignSelf: 'flex-start',
});

const Error = styled(Body16)({
  color: COLORS.ERROR,
});

const SignInModal = () => {
  const {t} = useTranslation('Modal.SignIn');
  const {popToTop} =
    useNavigation<NativeStackNavigationProp<ModalStackProps>>();

  const [isSigningIn, setIsSigningIn] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const signIn = useCallback(async () => {
    try {
      setIsSigningIn(true);
      await auth().signInWithEmailAndPassword(email, password);
      setIsSigningIn(false);
      popToTop();
    } catch (e: any) {
      setIsSigningIn(false);
      setError(e.code ?? e.message);
    }
  }, [setIsSigningIn, popToTop, email, password]);

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
            onSubmitEditing={signIn}
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
            onSubmitEditing={signIn}
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
          disabled={isSigningIn || !email || !password}
          loading={isSigningIn}
          onPress={signIn}>
          {t('signIn')}
        </StyledButton>
      </Gutters>
    </SheetModal>
  );
};

export default SignInModal;
