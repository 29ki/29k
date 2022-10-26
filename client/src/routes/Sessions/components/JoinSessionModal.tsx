import {RouteProp, useNavigation, useRoute} from '@react-navigation/native';
import React from 'react';

import Gutters from '../../../common/components/Gutters/Gutters';
import HalfModal from '../../../common/components/Modals/HalfModal';
import {Spacer24} from '../../../common/components/Spacers/Spacer';

import {ModalStackProps} from '../../../common/constants/routes';
import VerificationCode from '../../Profile/components/VerificationCode';
import useJoinSession from '../../Session/hooks/useJoinSession';
import useSessions from '../hooks/useSessions';

const JoinSessionModal = () => {
  const {
    params: {inviteCode: inviteCode},
  } = useRoute<RouteProp<ModalStackProps, 'JoinSessionModal'>>();
  const {fetchSessions} = useSessions();
  const joinSession = useJoinSession();
  const navigation = useNavigation();

  return (
    <HalfModal>
      <Gutters>
        <Spacer24 />
        <VerificationCode
          initialValue={inviteCode}
          onCodeCompleted={async value => {
            await joinSession(value);
            fetchSessions();
            navigation.goBack();
          }}
        />
      </Gutters>
    </HalfModal>
  );
};

export default JoinSessionModal;
