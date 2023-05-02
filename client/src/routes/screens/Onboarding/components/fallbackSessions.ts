import dayjs from 'dayjs';
import {
  LiveSessionType,
  SessionMode,
  SessionType,
} from '../../../../../../shared/src/schemas/Session';

const getFallbackSessions = () =>
  [
    {
      exerciseId: '3188a5ed-a1d6-451c-ae2a-f44f4df37495',
      type: SessionType.public,
      mode: SessionMode.live,
      startTime: dayjs()
        .add(1, 'day')
        .add(3, 'hours')
        .add(10, 'minutes')
        .toISOString(),
    },

    {
      exerciseId: '94575e97-fe03-4bfd-94a6-50aaf721d47e',
      type: SessionType.public,
      mode: SessionMode.live,
      startTime: dayjs().add(4, 'hours').add(40, 'minutes').toISOString(),
    },
    {
      exerciseId: '185889ec-753b-4e2c-8322-3004013e8a6e',
      type: SessionType.public,
      mode: SessionMode.live,
      startTime: dayjs().add(50, 'minutes').toISOString(),
    },
  ] as LiveSessionType[];

export default getFallbackSessions;
