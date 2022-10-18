import {useNavigation} from '@react-navigation/native';
import React, {useCallback, useEffect, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {Alert} from 'react-native';
import {useRecoilValue} from 'recoil';
import styled from 'styled-components/native';
import auth, {FirebaseAuthTypes} from '@react-native-firebase/auth';
import Button from '../../../common/components/Buttons/Button';
import Gutters from '../../../common/components/Gutters/Gutters';
import HalfModal from '../../../common/components/Modals/HalfModal';
import {Spacer16} from '../../../common/components/Spacers/Spacer';
import {Display24} from '../../../common/components/Typography/Display/Display';
import NS from '../../../lib/i18n/constants/namespaces';
import {userAtom} from '../../../lib/user/state/state';
import Input from '../../../common/components/Typography/TextInput/TextInput';
import {promoteUser} from '../api/user';

const Content = styled(Gutters)({
  justifyContent: 'space-between',
});

const VerificationModal = () => {
  const {t} = useTranslation(NS.COMPONENT.VERIFICATION_MODAL);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isUserPromoted, setIsUserPromoted] = useState(false);
  const [credentials, setCredentials] =
    useState<FirebaseAuthTypes.AuthCredential | null>(null);
  const [, setCode] = useState('');
  const user = useRecoilValue(userAtom);
  const navigation = useNavigation();

  const reAuthenticate = useCallback(async () => {
    try {
      if (credentials) {
        await auth().currentUser?.reauthenticateWithCredential(credentials);
        navigation.goBack();
      }
    } catch (error: any) {
      Alert.alert(error.message);
    }
  }, [credentials, navigation]);

  useEffect(() => {
    console.log('is', isUserPromoted);

    if (credentials && isUserPromoted) {
      reAuthenticate();
    }
  }, [reAuthenticate, credentials, isUserPromoted]);

  const updateCredentials = () => {
    const emailAndPasswordCredentials = auth.EmailAuthProvider.credential(
      email,
      password,
    );
    setCredentials(emailAndPasswordCredentials);
  };

  const onCodeChange = async (c: string) => {
    if (c.length === 6) {
      setCode(c);
      await promoteUser(parseInt(c, 10));
      setIsUserPromoted(true);
    } else {
      setCode(c);
    }
  };

  const setEmailAndPassword = async () => {
    try {
      const emailAndPasswordCredentials = auth.EmailAuthProvider.credential(
        email,
        password,
      );
      await auth().currentUser?.linkWithCredential(emailAndPasswordCredentials);

      // We get auth/id-token-revoked if not signIn again
      await auth().signInWithCredential(emailAndPasswordCredentials);
      setCredentials(emailAndPasswordCredentials);
    } catch (error: any) {
      Alert.alert(error.message);
    }
  };

  return (
    <HalfModal>
      <Spacer16 />
      <Content>
        <Display24>{t('header')}</Display24>
        <Spacer16 />
        {user?.isAnonymous && (
          <>
            <Input
              textContentType="emailAddress"
              keyboardType="email-address"
              autoCapitalize="none"
              autoComplete="email"
              autoCorrect={false}
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
              placeholder={t('password')}
              onChangeText={setPassword}
            />
            <Spacer16 />
            <Button onPress={setEmailAndPassword}>{t('upgrade')}</Button>
          </>
        )}
        {!user?.isAnonymous && !isUserPromoted && (
          <Input
            keyboardType="number-pad"
            placeholder={t('code')}
            onChangeText={onCodeChange}
          />
        )}
        {!user?.isAnonymous && isUserPromoted && (
          <>
            <Input
              textContentType="emailAddress"
              keyboardType="email-address"
              autoCapitalize="none"
              autoComplete="email"
              autoCorrect={false}
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
              placeholder={t('password')}
              onChangeText={setPassword}
            />
            <Spacer16 />
            <Button onPress={updateCredentials}>{t('signIn')}</Button>
          </>
        )}
        <Spacer16 />
      </Content>
    </HalfModal>
  );
};

export default VerificationModal;
