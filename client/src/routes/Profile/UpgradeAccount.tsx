import React, {useState} from 'react';
import {Alert} from 'react-native';
import {useRecoilValue} from 'recoil';
import {useTranslation} from 'react-i18next';
import auth from '@react-native-firebase/auth';
import {RouteProp, useRoute} from '@react-navigation/native';
import Button from '../../common/components/Buttons/Button';
import {Spacer16, Spacer48} from '../../common/components/Spacers/Spacer';
import Input from '../../common/components/Typography/TextInput/TextInput';
import * as NS from '../../../../shared/src/constants/namespaces';
import {Body14, Body16} from '../../common/components/Typography/Body/Body';
import {Heading16} from '../../common/components/Typography/Heading/Heading';
import Gutters from '../../common/components/Gutters/Gutters';
import {requestPromotion, verifyPromotion} from './api/user';
import styled from 'styled-components/native';
import HalfModal from '../../common/components/Modals/HalfModal';
import {userAtom} from '../../lib/user/state/state';
import VerificationCode from './components/VerificationCode';
import {ModalStackProps} from '../../lib/navigation/constants/routes';
import {VerificationError} from '../../../../shared/src/errors/User';
import {COLORS} from '../../../../shared/src/constants/colors';
import useIsPublicHost from '../../lib/user/hooks/useIsPublicHost';

const Heading = styled(Body16)({textAlign: 'center'});

const ErrorText = styled(Body14)({color: COLORS.ERROR, textAlign: 'center'});

const SuccessHeader = styled(Heading16)({textAlign: 'center'});
const SuccessText = styled(Body16)({textAlign: 'center'});

const UpgradeAccount = () => {
  const {t} = useTranslation(NS.SCREEN.UPGRADE_ACCOUNT);
  const {params} = useRoute<RouteProp<ModalStackProps, 'UpgradeAccount'>>();
  const user = useRecoilValue(userAtom);
  const [needToUpgrade, setNeedToUpgrade] = useState(false);
  const [haveCode, setHaveCode] = useState(Boolean(params?.code));
  const [haveRequested, setHaveRequested] = useState(false);
  const [upgradeComplete, setUpgradeComplete] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorString, setErrorString] = useState<string | null>(null);
  const {updateIsPublicHost} = useIsPublicHost();

  const requestCode = async () => {
    if (user?.isAnonymous) {
      setNeedToUpgrade(true);
    } else {
      await requestPromotion();
      setHaveRequested(true);
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

      await requestPromotion();
      setHaveRequested(true);
    } catch (error: any) {
      Alert.alert(error.message);
    }
  };

  const onCodeCompleted = async (code: number) => {
    const error = await verifyPromotion(code);

    if (!error) {
      await updateIsPublicHost();
      setUpgradeComplete(true);
    } else {
      switch (error) {
        case VerificationError.requestNotFound:
          setErrorString(t('errors.verificationNotFound'));
          break;
        case VerificationError.requestDeclined:
          setErrorString(t('errors.verificationDeclined'));
          break;
        case VerificationError.verificationAlreadyCalimed:
          setErrorString(t('errors.verificationAlreadyClaimed'));
          break;
        case VerificationError.verificationFailed:
          setErrorString(t('errors.verificationFailed'));
          break;

        default:
          break;
      }
    }
  };

  return (
    <HalfModal>
      <Gutters>
        <Spacer48 />

        {(!needToUpgrade || haveRequested) && !haveCode && !upgradeComplete && (
          <>
            <Heading>
              {haveRequested ? t('requestComplete') : t('text')}
            </Heading>
            <Spacer16 />
            {!haveRequested && (
              <Button onPress={requestCode}>{t('requestCodeButton')}</Button>
            )}
            <Spacer16 />
            {!user?.isAnonymous && (
              <Button onPress={() => setHaveCode(true)}>
                {t('haveCodeButton')}
              </Button>
            )}
          </>
        )}

        {!haveRequested && needToUpgrade && !haveCode && !upgradeComplete && (
          <>
            <Heading>{t('needToUpgrade')}</Heading>
            <Spacer16 />
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
          </>
        )}
        {haveCode && !upgradeComplete && (
          <>
            <Heading>{t('enterCode')}</Heading>
            <Spacer16 />
            <VerificationCode
              prefillCode={params?.code}
              onCodeCompleted={onCodeCompleted}
            />
            {errorString && (
              <>
                <Spacer16 />
                <ErrorText>{errorString}</ErrorText>
              </>
            )}
          </>
        )}
        {upgradeComplete && (
          <>
            <SuccessHeader>{t('success.header')}</SuccessHeader>
            <SuccessText>{t('success.text')}</SuccessText>
          </>
        )}
        <Spacer48 />
      </Gutters>
    </HalfModal>
  );
};

export default UpgradeAccount;
