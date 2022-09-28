import React, {useState} from 'react';
import {useTranslation} from 'react-i18next';
import auth from '@react-native-firebase/auth';
import {Alert} from 'react-native';
import styled from 'styled-components/native';

import Button from '../../../common/components/Buttons/Button';
import {Spacer16} from '../../../common/components/Spacers/Spacer';
import {
  Heading22,
  Heading24,
} from '../../../common/components/Typography/Heading/Heading';
import NS from '../../../lib/i18n/constants/namespaces';
import Input from '../../../common/components/Typography/TextInput/TextInput';
import {Body16, Body18} from '../../../common/components/Typography/Body/Body';
import {useRecoilValue} from 'recoil';
import {userAtom} from '../../../lib/user/state/state';

const Row = styled.View({
  flexDirection: 'row',
  justifyContent: 'flex-start',
  alignItems: 'center',
});

const CurrentUser = () => {
  const {t} = useTranslation(NS.SCREEN.PROFILE);
  const user = useRecoilValue(userAtom);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const setEmailAndPassword = async () => {
    try {
      const emailAndPasswordCredentials = auth.EmailAuthProvider.credential(
        email,
        password,
      );
      await auth().currentUser?.linkWithCredential(emailAndPasswordCredentials);

      // We get auth/id-token-revoked if not signIn again
      await auth().signInWithCredential(emailAndPasswordCredentials);
    } catch (error: any) {
      Alert.alert(error.message);
    }
  };

  const signIn = async () => {
    try {
      await auth().signInWithEmailAndPassword(email, password);
    } catch (error: any) {
      Alert.alert(error.message);
    }
  };

  return (
    <>
      {user && (
        <>
          <Heading24>{t('userId')}</Heading24>
          <Body18 selectable>{user.uid}</Body18>
          <Spacer16 />
          {!user.isAnonymous && (
            <>
              <Heading24>{t('email')}</Heading24>
              <Body18 selectable>{user.email}</Body18>
              <Spacer16 />
            </>
          )}
          <Button onPress={() => auth().signOut()}>{t('signOut')}</Button>
        </>
      )}
      <Spacer16 />
      {user?.isAnonymous && (
        <>
          <Heading22>{t('upgrade')}</Heading22>
          <Spacer16 />
          <Input
            textContentType="emailAddress"
            keyboardType="email-address"
            autoCapitalize="none"
            autoComplete="email"
            autoCorrect={false}
            onSubmitEditing={setEmailAndPassword}
            placeholder={t('email')}
            onChangeText={setEmail}
          />
          <Spacer16 />
          <Input
            textContentType="newPassword"
            secureTextEntry
            autoCapitalize="none"
            autoComplete="password-new"
            autoCorrect={false}
            onSubmitEditing={setEmailAndPassword}
            placeholder={t('password')}
            onChangeText={setPassword}
          />
          <Spacer16 />
          <Button onPress={setEmailAndPassword}>{t('upgrade')}</Button>
        </>
      )}
      {!user && (
        <>
          <Heading22>{t('signIn')}</Heading22>
          <Spacer16 />
          <Input
            textContentType="emailAddress"
            keyboardType="email-address"
            autoComplete="email"
            autoCapitalize="none"
            autoCorrect={false}
            onSubmitEditing={signIn}
            placeholder={t('email')}
            onChangeText={setEmail}
          />
          <Spacer16 />
          <Input
            textContentType="password"
            secureTextEntry
            autoCapitalize="none"
            autoComplete="password"
            autoCorrect={false}
            onSubmitEditing={signIn}
            placeholder={t('password')}
            onChangeText={setPassword}
          />
          <Spacer16 />
          <Row>
            <Button onPress={signIn}>{t('signIn')}</Button>
            <Spacer16 />
            <Body16>{t('or')}</Body16>
            <Spacer16 />
            <Button onPress={() => auth().signInAnonymously()}>
              {t('signInAnonymously')}
            </Button>
          </Row>
        </>
      )}
    </>
  );
};

export default CurrentUser;
