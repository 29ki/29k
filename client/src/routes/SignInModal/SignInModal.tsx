import React, {useCallback, useState} from 'react';
import {useTranslation} from 'react-i18next';
import styled from 'styled-components/native';
import auth from '@react-native-firebase/auth';

import {BottomSheetActionTextInput} from '../../common/components/ActionList/ActionItems/ActionTextInput';
import ActionList from '../../common/components/ActionList/ActionList';
import Button from '../../common/components/Buttons/Button';

import Gutters from '../../common/components/Gutters/Gutters';
import SheetModal from '../../common/components/Modals/SheetModal';
import {Spacer16, Spacer24} from '../../common/components/Spacers/Spacer';
import {ModalHeading} from '../../common/components/Typography/Heading/Heading';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {ModalStackProps} from '../../lib/navigation/constants/routes';
import {Body16} from '../../common/components/Typography/Body/Body';
import {COLORS} from '../../../../shared/src/constants/colors';

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

  const [signingIn, setSigningIn] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const signIn = useCallback(async () => {
    try {
      setSigningIn(true);
      if (auth().currentUser) {
        await auth().signOut();
      }
      await auth().signInWithEmailAndPassword(email, password);
      setSigningIn(false);
      popToTop();
    } catch (e: any) {
      setSigningIn(false);
      setError(e.code ?? e.message);
    }
  }, [setSigningIn, popToTop, email, password]);

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
            textContentType="newPassword"
            secureTextEntry
            autoCapitalize="none"
            autoComplete="password-new"
            autoCorrect={false}
            onSubmitEditing={signIn}
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
        <StyledButton
          variant="primary"
          disabled={signingIn}
          loading={signingIn}
          onPress={signIn}>
          {t('signIn')}
        </StyledButton>
      </Gutters>
    </SheetModal>
  );
};

export default SignInModal;
