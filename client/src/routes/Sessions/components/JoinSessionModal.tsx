import {RouteProp, useNavigation, useRoute} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import React from 'react';

import Gutters from '../../../common/components/Gutters/Gutters';
import HalfModal from '../../../common/components/Modals/HalfModal';
import {Spacer24} from '../../../common/components/Spacers/Spacer';

import {ModalStackProps} from '../../../lib/navigation/constants/routes';

import VerificationCode from '../../Profile/components/VerificationCode';
import useJoinSession from '../../Session/hooks/useJoinSession';
import useSessions from '../hooks/useSessions';

const JoinSessionModal = () => {
  const {
    params: {inviteCode: inviteCode},
  } = useRoute<RouteProp<ModalStackProps, 'JoinSessionModal'>>();
  const {fetchSessions} = useSessions();
  const joinSession = useJoinSession();
  const {navigate} =
    useNavigation<NativeStackNavigationProp<ModalStackProps, 'SessionModal'>>();

  return (
    <HalfModal>
      <Gutters>
        <Spacer24 />
        <VerificationCode
          prefillCode={`${inviteCode || ''}`}
          onCodeCompleted={async value => {
            const session = await joinSession(value);
            fetchSessions();
            navigate('SessionModal', {session: session});
          }}
        />
      </Gutters>
    </HalfModal>
  );
};

export default JoinSessionModal;
