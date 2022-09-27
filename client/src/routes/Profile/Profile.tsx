import React, {useState} from 'react';
import {useRecoilValue} from 'recoil';
import {useTranslation} from 'react-i18next';
import auth from '@react-native-firebase/auth';

import styled from 'styled-components/native';
import Button from '../../common/components/Buttons/Button';
import Gutters from '../../common/components/Gutters/Gutters';
import {Spacer16, Spacer48} from '../../common/components/Spacers/Spacer';
import {Body18} from '../../common/components/Typography/Body/Body';
import useCheckForUpdate from '../../lib/codePush/hooks/useCheckForUpdate';
import useClearUpdates from '../../lib/codePush/hooks/useClearUpdates';
import {useUiLib} from '../../lib/uiLib/hooks/useUiLib';
import {userAtom} from '../../lib/user/state/state';
import {LANGUAGE_TAGS} from '../../../../shared/src/constants/i18n';
import {
  Heading16,
  Heading24,
} from '../../common/components/Typography/Heading/Heading';
import NS from '../../lib/i18n/constants/namespaces';
import Input from '../../common/components/Typography/TextInput/TextInput';
import {Alert} from 'react-native';

const Wrapper = styled.View({
  flex: 1,
  justifyContent: 'center',
  alignItems: 'center',
});

const Row = styled.View({
  flexDirection: 'row',
  justifyContent: 'space-between',
});

const SetEmailAndPassword = () => {
  const {t} = useTranslation(NS.SCREEN.PROFILE);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const setEmailAndPassword = async () => {
    try {
      const emailAndPasswordCredentials = auth.EmailAuthProvider.credential(
        email,
        password,
      );
      await auth().currentUser?.linkWithCredential(emailAndPasswordCredentials);
    } catch (error) {
      Alert.alert(error.message);
    }
  };

  return (
    <>
      <Heading16>{t('setEmailAndPassword')}</Heading16>
      <Spacer16 />
      <Input placeholder={t('email')} onChangeText={setEmail} />
      <Spacer16 />
      <Input placeholder={t('password')} onChangeText={setPassword} />
      <Spacer16 />
      <Button onPress={setEmailAndPassword}>{t('save')}</Button>
    </>
  );
};

const Profile = () => {
  const {i18n, t} = useTranslation(NS.SCREEN.PROFILE);
  const user = useRecoilValue(userAtom);
  const {toggle: toggleUiLib} = useUiLib();
  const clearUpdates = useClearUpdates();
  const checkForUpdate = useCheckForUpdate();

  return (
    <Wrapper>
      <Gutters>
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
          </>
        )}
        <Button onPress={toggleUiLib}>{t('uiLib')}</Button>
        <Spacer16 />
        <Button onPress={clearUpdates}>{t('clearUpdate')}</Button>
        <Spacer16 />
        <Button onPress={checkForUpdate}>{t('checkUpdate')}</Button>
        <Spacer48 />

        <Heading24>{t('language')}</Heading24>
        <Spacer16 />
        <Row>
          {LANGUAGE_TAGS.map(languageTag => (
            <Button
              key={languageTag}
              onPress={() => i18n.changeLanguage(languageTag)}>
              {languageTag.toUpperCase()}
            </Button>
          ))}
        </Row>
        <Spacer48 />

        {user?.isAnonymous && <SetEmailAndPassword />}
        <Spacer48 />

        <Button onPress={() => auth().signOut()}>{t('logout')}</Button>
      </Gutters>
    </Wrapper>
  );
};

export default Profile;
