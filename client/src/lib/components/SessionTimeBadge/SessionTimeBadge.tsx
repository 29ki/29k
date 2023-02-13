import dayjs from 'dayjs';
import React from 'react';
import {useTranslation} from 'react-i18next';
import styled from 'styled-components/native';

import {LiveSession} from '../../../../../shared/src/types/Session';
import useSessionStartTime from '../../session/hooks/useSessionStartTime';

import Badge from '../Badge/Badge';
import {PrivateIcon, PublicIcon} from '../Icons';
import {Spacer4} from '../Spacers/Spacer';
import {Body14} from '../Typography/Body/Body';

const Row = styled.View({
  flexDirection: 'row',
  alignItems: 'center',
});

const SessionTimeBadge: React.FC<{session: LiveSession}> = ({session}) => {
  const {t} = useTranslation('Component.SessionTimeBadge');
  const sessionTime = useSessionStartTime(dayjs(session.startTime));

  return (
    <Row>
      {!sessionTime.isReadyToJoin && (
        <>
          {sessionTime.isInLessThanAnHour ? (
            <Body14>{t('counterLabel.startsIn')}</Body14>
          ) : (
            <Body14>{t('counterLabel.starts')}</Body14>
          )}
          <Spacer4 />
        </>
      )}
      <Badge
        text={sessionTime.isStarted ? t('counter.started') : sessionTime.time}
        Icon={session.type === 'private' ? <PrivateIcon /> : <PublicIcon />}
      />
    </Row>
  );
};

export default SessionTimeBadge;
