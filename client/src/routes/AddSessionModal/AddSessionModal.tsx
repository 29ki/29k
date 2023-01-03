import {RouteProp, useNavigation, useRoute} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import React, {useCallback, useState} from 'react';
import {useTranslation} from 'react-i18next';
import styled from 'styled-components/native';

import {JoinSessionError} from '../../../../shared/src/errors/Session';
import {COLORS} from '../../../../shared/src/constants/colors';
import Gutters from '../../lib/components/Gutters/Gutters';
import {Spacer16, Spacer8} from '../../lib/components/Spacers/Spacer';
import {Body16} from '../../lib/components/Typography/Body/Body';
import VerificationCode from '../../lib/components/VerificationCode/VerificationCode';
import {ModalStackProps} from '../../lib/navigation/constants/routes';
import {joinSession} from '../../lib/sessions/api/session';
import useSessions from '../../lib/sessions/hooks/useSessions';
import CardModal from '../../lib/components/Modals/CardModal';
import {ModalHeading} from '../../lib/components/Typography/Heading/Heading';
import Button from '../../lib/components/Buttons/Button';
import {Session} from '../../../../shared/src/types/Session';
import useLogSessionMetricEvents from '../../lib/sessions/hooks/useLogSessionMetricEvents';

const ErrorText = styled(Body16)({color: COLORS.ERROR, textAlign: 'center'});
const BodyText = styled(Body16)({textAlign: 'center'});
const ButtonWrapper = styled.View({
  flexDirection: 'row',
  justifyContent: 'center',
});

const AddSessionModal = () => {
  const {t} = useTranslation('Modal.JoinSession');
  const {params: {inviteCode} = {}} =
    useRoute<RouteProp<ModalStackProps, 'AddSessionModal'>>();
  const {fetchSessions} = useSessions();
  const {goBack, navigate, popToTop} =
    useNavigation<NativeStackNavigationProp<ModalStackProps, 'SessionModal'>>();
  const [errorString, setErrorString] = useState<string | null>(null);
  const logSessionMetricEvent = useLogSessionMetricEvents();

  const onCodeType = useCallback(() => {
    setErrorString(null);
  }, [setErrorString]);

  const onCodeCompleted = useCallback(
    async (value: Session['inviteCode']) => {
      try {
        const session = await joinSession(value);
        logSessionMetricEvent('Add Sharing Session', session);
        fetchSessions();
        goBack();
        navigate('SessionModal', {session: session});
      } catch (err) {
        switch ((err as Error).message) {
          case JoinSessionError.notFound:
            setErrorString(t('errors.sessionNotFound'));
            break;
          default:
            goBack();
            navigate('SessionUnavailableModal');
            break;
        }
      }
    },
    [fetchSessions, goBack, setErrorString, navigate, t, logSessionMetricEvent],
  );

  const onPressCreate = useCallback(() => {
    popToTop();
    navigate('CreateSessionModal');
  }, [popToTop, navigate]);

  return (
    <CardModal>
      <Gutters>
        {errorString ? (
          <ErrorText>{errorString}</ErrorText>
        ) : (
          <ModalHeading>{t('title')}</ModalHeading>
        )}
        <Spacer16 />
        <VerificationCode
          hasError={Boolean(errorString)}
          prefillCode={`${inviteCode || ''}`}
          onCodeType={onCodeType}
          onCodeCompleted={onCodeCompleted}
        />
        <Spacer8 />
        <BodyText>{t('create.or')}</BodyText>
        <Spacer8 />
        <ButtonWrapper>
          <Button onPress={onPressCreate}>{t('create.cta')}</Button>
        </ButtonWrapper>
      </Gutters>
    </CardModal>
  );
};

export default AddSessionModal;
