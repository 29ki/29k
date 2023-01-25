import React, {useState} from 'react';
import {Alert} from 'react-native';
import {useTranslation} from 'react-i18next';
import auth from '@react-native-firebase/auth';
import {useNavigation} from '@react-navigation/native';

import {ModalStackProps} from '../../lib/navigation/constants/routes';

import Button from '../../lib/components/Buttons/Button';
import {Spacer16} from '../../lib/components/Spacers/Spacer';
import {BottomSheetTextInput} from '../../lib/components/Typography/TextInput/TextInput';
import {ModalHeading} from '../../lib/components/Typography/Heading/Heading';
import Gutters from '../../lib/components/Gutters/Gutters';
import CardModal from '../../lib/components/Modals/CardModal';

import {requestPromotion} from '../Profile/api/user';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';

const UpgradeAccountModal = () => {
  const {t} = useTranslation('Modal.UpgradeAccount');

  const {navigate, goBack} =
    useNavigation<NativeStackNavigationProp<ModalStackProps>>();

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

      await requestPromotion();
      goBack();
      navigate('RequestPublicHostModal', {haveRequested: true});
    } catch (error: any) {
      Alert.alert(error.message);
    }
  };

  return (
    <CardModal>
      <Gutters>
        <ModalHeading>{t('title')}</ModalHeading>
        <Spacer16 />
        <BottomSheetTextInput
          textContentType="emailAddress"
          keyboardType="email-address"
          autoCapitalize="none"
          autoComplete="email"
          autoCorrect={false}
          placeholder={t('email')}
          onChangeText={setEmail}
        />
        <Spacer16 />
        <BottomSheetTextInput
          textContentType="newPassword"
          secureTextEntry
          autoCapitalize="none"
          autoComplete="password-new"
          autoCorrect={false}
          placeholder={t('password')}
          onChangeText={setPassword}
        />
        <Spacer16 />
        <Button onPress={setEmailAndPassword}>{t('button')}</Button>
      </Gutters>
    </CardModal>
  );
};

export default UpgradeAccountModal;
