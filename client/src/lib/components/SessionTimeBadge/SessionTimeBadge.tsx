import dayjs from 'dayjs';
import React from 'react';
import {useTranslation} from 'react-i18next';
import styled from 'styled-components/native';

import {LiveSessionType} from '../../../../../shared/src/schemas/Session';
import useSessionStartTime from '../../session/hooks/useSessionStartTime';

import Badge from '../Badge/Badge';
import {FriendsIcon, CommunityIcon} from '../Icons';
import {Spacer4} from '../Spacers/Spacer';
import {Body14} from '../Typography/Body/Body';

const Row = styled.View({
  flexDirection: 'row',
  alignItems: 'center',
});

const SessionTimeBadge: React.FC<{session: LiveSessionType}> = ({session}) => {
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
        IconAfter={
          session.type === 'private' ? <FriendsIcon /> : <CommunityIcon />
        }
      />
    </Row>
  );
};

export default SessionTimeBadge;
