import React, {useState} from 'react';
import {useTranslation} from 'react-i18next';
import auth from '@react-native-firebase/auth';
import {Alert} from 'react-native';
import styled from 'styled-components/native';

import Button from '../../../common/components/Buttons/Button';
import {Spacer16} from '../../../common/components/Spacers/Spacer';
import {Heading18} from '../../../common/components/Typography/Heading/Heading';
import Input from '../../../common/components/Typography/TextInput/TextInput';
import {Body16, Body18} from '../../../common/components/Typography/Body/Body';
import {useRecoilValue} from 'recoil';
import {userAtom} from '../../../lib/user/state/state';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootStackProps} from '../../../lib/navigation/constants/routes';

const Row = styled.View({
  flexDirection: 'row',
  justifyContent: 'flex-start',
  alignItems: 'center',
});
const StartCol = styled.View({
  alignItems: 'flex-start',
});

type CurrentUserProps = {
  isPublicHost: boolean;
};

const CurrentUser: React.FC<CurrentUserProps> = ({isPublicHost = false}) => {
  const {t} = useTranslation('Screen.Profile');
  const {navigate} = useNavigation<NativeStackNavigationProp<RootStackProps>>();
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

  const requestPublicHostRole = async () => {
    navigate('UpgradeAccount');
  };

  return (
    <>
      {user && (
        <StartCol>
          <Heading18>{t('userId')}</Heading18>
          <Body18 selectable>{user.uid}</Body18>
          <Spacer16 />
          {!user.isAnonymous && (
            <>
              <Heading18>{t('email')}</Heading18>
              <Body16 selectable>{user.email}</Body16>
              <Spacer16 />
            </>
          )}
          <Button onPress={() => auth().signOut()}>{t('signOut')}</Button>
        </StartCol>
      )}
      <Spacer16 />
      {user?.isAnonymous && (
        <>
          <Heading18>{t('upgrade')}</Heading18>
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
          <StartCol>
            <Button onPress={setEmailAndPassword}>{t('upgrade')}</Button>
          </StartCol>
        </>
      )}
      {!user && (
        <>
          <Heading18>{t('signIn')}</Heading18>
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
      <Spacer16 />
      {!isPublicHost && (
        <StartCol>
          <Button onPress={requestPublicHostRole}>
            {t('requestPublicHostRoleButton')}
          </Button>
        </StartCol>
      )}
    </>
  );
};

export default CurrentUser;
