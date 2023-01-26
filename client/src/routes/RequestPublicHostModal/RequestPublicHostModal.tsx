import React, {useState} from 'react';
import {useTranslation} from 'react-i18next';
import {RouteProp, useRoute} from '@react-navigation/native';
import styled from 'styled-components/native';

import {ModalStackProps} from '../../lib/navigation/constants/routes';
import {VerificationError} from '../../../../shared/src/errors/User';
import {COLORS} from '../../../../shared/src/constants/colors';

import Button from '../../lib/components/Buttons/Button';
import {Spacer16, Spacer8} from '../../lib/components/Spacers/Spacer';
import {Body16} from '../../lib/components/Typography/Body/Body';
import {ModalHeading} from '../../lib/components/Typography/Heading/Heading';
import CardModal from '../../lib/components/Modals/CardModal';
import VerificationCode from '../../lib/components/VerificationCode/VerificationCode';

import {requestPromotion, verifyPromotion} from '../Profile/api/user';

import useUserState from '../../lib/user/state/state';
import useUserClaims from '../../lib/user/hooks/useUserClaims';
import Gutters from '../../lib/components/Gutters/Gutters';

const ErrorText = styled(Body16)({color: COLORS.ERROR, textAlign: 'center'});
const ButtonWrapper = styled.View({
  flexDirection: 'row',
  justifyContent: 'center',
});
const SuccessText = styled(Body16)({textAlign: 'center'});
const BodyText = styled(Body16)({textAlign: 'center'});

const RequestPublicHostModal = () => {
  const {t} = useTranslation('Modal.RequestPublicHost');
  const {params} =
    useRoute<RouteProp<ModalStackProps, 'RequestPublicHostModal'>>();
  const user = useUserState(state => state.user);
  const [haveRequested, setHaveRequested] = useState(
    params?.haveRequested ?? false,
  );
  const [upgradeComplete, setUpgradeComplete] = useState(false);

  const [errorString, setErrorString] = useState<string | null>(null);
  const {updateUserClaims} = useUserClaims();

  const requestCode = async () => {
    await requestPromotion();
    setHaveRequested(true);
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
    if (!upgradeComplete) {
      return (
        <>
          {errorString && <ErrorText>{errorString}</ErrorText>}
          {!errorString && (
            <ModalHeading>
              {haveRequested ? t('requestComplete') : t('text')}
            </ModalHeading>
          )}
          {!user?.isAnonymous && (
            <>
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
          )}

          {!haveRequested && (
            <>
              <Spacer8 />
              <BodyText>{t('or')}</BodyText>
              <Spacer8 />
              <ButtonWrapper>
                <Button onPress={requestCode}>{t('requestCodeButton')}</Button>
              </ButtonWrapper>
            </>
          )}

          <Spacer16 />
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
    <CardModal>
      <Gutters>{renderContent()}</Gutters>
    </CardModal>
  );
};

export default RequestPublicHostModal;
