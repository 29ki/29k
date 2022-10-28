import {RouteProp, useNavigation, useRoute} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import React from 'react';
import {useTranslation} from 'react-i18next';

import Gutters from '../../../common/components/Gutters/Gutters';
import HalfModal from '../../../common/components/Modals/HalfModal';
import {Spacer16, Spacer24} from '../../../common/components/Spacers/Spacer';
import {Display24} from '../../../common/components/Typography/Display/Display';

import {ModalStackProps} from '../../../lib/navigation/constants/routes';

import VerificationCode from '../../Profile/components/VerificationCode';
import useJoinSession from '../../Session/hooks/useJoinSession';
import useSessions from '../hooks/useSessions';

const JoinSessionModal = () => {
  const {t} = useTranslation('Component.JoinSessionModal');
  const {
    params: {inviteCode: inviteCode},
  } = useRoute<RouteProp<ModalStackProps, 'JoinSessionModal'>>();
  const {fetchSessions} = useSessions();
  const joinSession = useJoinSession();
  const {goBack, navigate} =
    useNavigation<NativeStackNavigationProp<ModalStackProps, 'SessionModal'>>();

  return (
    <HalfModal>
      <Spacer16 />
      <Gutters>
        <Display24>{t('title')}</Display24>
        <Spacer24 />
        <VerificationCode
          prefillCode={`${inviteCode || ''}`}
          onCodeCompleted={async value => {
            const session = await joinSession(value);
            fetchSessions();
            goBack();
            navigate('SessionModal', {session: session});
          }}
        />
      </Gutters>
    </HalfModal>
  );
};

export default JoinSessionModal;
