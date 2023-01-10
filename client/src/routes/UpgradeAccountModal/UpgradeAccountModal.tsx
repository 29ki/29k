import React, {useState} from 'react';
import {Alert} from 'react-native';
import {useTranslation} from 'react-i18next';
import auth from '@react-native-firebase/auth';
import {RouteProp, useRoute} from '@react-navigation/native';
import Button from '../../lib/components/Buttons/Button';
import {Spacer16} from '../../lib/components/Spacers/Spacer';
import {BottomSheetTextInput} from '../../lib/components/Typography/TextInput/TextInput';
import {Body16} from '../../lib/components/Typography/Body/Body';
import {ModalHeading} from '../../lib/components/Typography/Heading/Heading';
import Gutters from '../../lib/components/Gutters/Gutters';
import {requestPromotion, verifyPromotion} from '../Profile/api/user';
import styled from 'styled-components/native';
import SheetModal from '../../lib/components/Modals/SheetModal';
import useUserState from '../../lib/user/state/state';
import VerificationCode from '../../lib/components/VerificationCode/VerificationCode';
import {ModalStackProps} from '../../lib/navigation/constants/routes';
import {VerificationError} from '../../../../shared/src/errors/User';
import {COLORS} from '../../../../shared/src/constants/colors';
import useUserClaims from '../../lib/user/hooks/useUserClaims';

const ErrorText = styled(Body16)({color: COLORS.ERROR, textAlign: 'center'});

const SuccessText = styled(Body16)({textAlign: 'center'});

const UpgradeAccountModal = () => {
  const {t} = useTranslation('Modal.UpgradeAccount');
  const {params} =
    useRoute<RouteProp<ModalStackProps, 'UpgradeAccountModal'>>();
  const user = useUserState(state => state.user);
  const [haveCode, setHaveCode] = useState(Boolean(params?.code));
  const [haveRequested, setHaveRequested] = useState(false);
  const [upgradeComplete, setUpgradeComplete] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorString, setErrorString] = useState<string | null>(null);
  const {updateUserClaims} = useUserClaims();

  const needToUpgrade = Boolean(user?.isAnonymous);

  const requestCode = async () => {
    await requestPromotion();
    setHaveRequested(true);
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
      await updateUserClaims(true);
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

  const renderContent = () => {
    if (!haveRequested && needToUpgrade && !haveCode && !upgradeComplete) {
      return (
        <>
          <ModalHeading>{t('needToUpgrade')}</ModalHeading>
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
        </>
      );
    }

    if ((!needToUpgrade || haveRequested) && !haveCode && !upgradeComplete) {
      return (
        <>
          <ModalHeading>
            {haveRequested ? t('requestComplete') : t('text')}
          </ModalHeading>
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
      );
    }

    if (haveCode && !upgradeComplete) {
      return (
        <>
          {errorString ? (
            <ErrorText>{errorString}</ErrorText>
          ) : (
            <ModalHeading>{t('enterCode')}</ModalHeading>
          )}
          <Spacer16 />
          <VerificationCode
            hasError={Boolean(errorString)}
            prefillCode={params?.code}
            onCodeType={() => {
              setErrorString(null);
            }}
            onCodeCompleted={onCodeCompleted}
          />
        </>
      );
    }

    return (
      <>
        <ModalHeading>{t('success.header')}</ModalHeading>
        <SuccessText>{t('success.text')}</SuccessText>
      </>
    );
  };

  return (
    <SheetModal>
      <Gutters>{renderContent()}</Gutters>
    </SheetModal>
  );
};

export default UpgradeAccountModal;
