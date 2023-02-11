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
import {LiveSession} from '../../../../shared/src/types/Session';
import useLogSessionMetricEvents from '../../lib/sessions/hooks/useLogSessionMetricEvents';

const ErrorText = styled(Body16)({color: COLORS.ERROR, textAlign: 'center'});

const AddSessionModal = () => {
  const {t} = useTranslation('Modal.JoinSession');
  const {params: {inviteCode} = {}} =
    useRoute<RouteProp<ModalStackProps, 'AddSessionByInviteModal'>>();
  const {fetchSessions} = useSessions();
  const {goBack, navigate} =
    useNavigation<NativeStackNavigationProp<ModalStackProps, 'SessionModal'>>();
  const [errorString, setErrorString] = useState<string | null>(null);
  const logSessionMetricEvent = useLogSessionMetricEvents();

  const onCodeType = useCallback(() => {
    setErrorString(null);
  }, [setErrorString]);

  const onCodeCompleted = useCallback(
    async (value: LiveSession['inviteCode']) => {
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
      </Gutters>
    </CardModal>
  );
};

export default AddSessionModal;
