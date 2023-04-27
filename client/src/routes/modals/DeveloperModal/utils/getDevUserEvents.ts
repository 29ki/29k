import dayjs from 'dayjs';
import {
  CompletedSessionEvent,
  FeedbackEvent,
  PostEvent,
} from '../../../../../../shared/src/types/Event';
import {
  SessionMode,
  SessionType,
} from '../../../../../../shared/src/schemas/Session';

export const getCompletedSessions = (
  hostId: string,
): CompletedSessionEvent[] => [
  {
    type: 'completedSession',
    payload: {
      id: '10abff47-23d5-4587-9683-7c8df85c4d08',
      exerciseId: 'c5b1197a-4eec-4699-9dad-0e3d6323967b',
      language: 'en',
      type: SessionType.private,
      mode: SessionMode.live,
      hostId,
    },
    timestamp: dayjs().subtract(3, 'months').toISOString(),
  },
  {
    type: 'completedSession',
    payload: {
      id: '10abff47-23d5-4587-9683-7c8df85c4d09',
      exerciseId: '095f9642-73b6-4c9a-ae9a-ea7dea7363f5',
      language: 'en',
      type: SessionType.private,
      mode: SessionMode.async,
    },
    timestamp: dayjs().subtract(3, 'months').toISOString(),
  },
  {
    type: 'completedSession',
    payload: {
      id: '10abff47-23d5-4587-9683-7c8df85c4d10',
      exerciseId: '185889ec-753b-4e2c-8322-3004013e8a6e',
      language: 'en',
      type: SessionType.public,
      mode: SessionMode.live,
    },
    timestamp: dayjs().subtract(2, 'months').toISOString(),
  },
  {
    type: 'completedSession',
    payload: {
      id: '10abff47-23d5-4587-9683-7c8df85c4d11',
      exerciseId: '185889ec-753b-4e2c-8322-3004013e8a6e',
      language: 'en',
      type: SessionType.private,
      mode: SessionMode.live,
      hostId,
    },
    timestamp: dayjs().subtract(2, 'months').toISOString(),
  },
  {
    type: 'completedSession',
    payload: {
      id: '10abff47-23d5-4587-9683-7c8df85c4d12',
      exerciseId: '3188a5ed-a1d6-451c-ae2a-f44f4df37495',
      language: 'en',
      type: SessionType.private,
      mode: SessionMode.live,
    },
    timestamp: dayjs().subtract(2, 'months').toISOString(),
  },
  {
    type: 'completedSession',
    payload: {
      id: '10abff47-23d5-4587-9683-7c8df85c4d13',
      exerciseId: '185889ec-753b-4e2c-8322-3004013e8a6e',
      language: 'en',
      type: SessionType.private,
      mode: SessionMode.async,
    },
    timestamp: dayjs().toISOString(),
  },
];

export const getFeedback = (): FeedbackEvent[] => [
  {
    timestamp: dayjs().subtract(3, 'months').toISOString(),
    type: 'feedback',
    payload: {
      question: 'Was this meaningful for you?',
      answer: true,
      comment: 'Loved it, felt heard and safe.',
      exerciseId: '185889ec-753b-4e2c-8322-3004013e8a6e',
      sessionId: '10abff47-23d5-4587-9683-7c8df85c4d13',
    },
  },
  {
    timestamp: dayjs().subtract(3, 'months').toISOString(),
    type: 'feedback',
    payload: {
      question: 'Was this meaningful for you?',
      answer: true,
      comment: 'Loved it, so much fun.',
      sessionId: '10abff47-23d5-4587-9683-7c8df85c4d08',
      exerciseId: 'c5b1197a-4eec-4699-9dad-0e3d6323967b',
    },
  },
  {
    timestamp: dayjs().subtract(2, 'months').toISOString(),
    type: 'feedback',
    payload: {
      question: 'Was this meaningful for you?',
      answer: false,
      comment: 'We didnt have much to talk about',
      sessionId: '10abff47-23d5-4587-9683-7c8df85c4d10',
      exerciseId: '185889ec-753b-4e2c-8322-3004013e8a6e',
    },
  },
  {
    timestamp: dayjs().subtract(2, 'months').toISOString(),
    type: 'feedback',
    payload: {
      question: 'Was this meaningful for you?',
      answer: true,
      comment: 'Loved it, felt heard and safe.',
      sessionId: '10abff47-23d5-4587-9683-7c8df85c4d11',
      exerciseId: '185889ec-753b-4e2c-8322-3004013e8a6e',
    },
  },
  {
    timestamp: dayjs().subtract(2, 'months').toISOString(),
    type: 'feedback',
    payload: {
      question: 'Was this meaningful for you?',
      answer: false,
      sessionId: '10abff47-23d5-4587-9683-7c8df85c4d12',
      exerciseId: '3188a5ed-a1d6-451c-ae2a-f44f4df37495',
    },
  },
];

export const getSharingPosts = (): PostEvent[] => [
  {
    timestamp: dayjs().subtract(3, 'months').toISOString(),
    type: 'post',
    payload: {
      sessionId: '10abff47-23d5-4587-9683-7c8df85c4d09',
      exerciseId: '095f9642-73b6-4c9a-ae9a-ea7dea7363f5',
      sharingId: 'sharing',
      isPublic: false,
      isAnonymous: false,
      text: 'This is my personal private relfections that I added to the exercise etc etc etc etc etc',
    },
  },
  {
    timestamp: dayjs().toISOString(),
    type: 'post',
    payload: {
      sessionId: '10abff47-23d5-4587-9683-7c8df85c4d13',
      exerciseId: '185889ec-753b-4e2c-8322-3004013e8a6e',
      sharingId: 'sharing-1',
      isPublic: true,
      isAnonymous: true,
      text: 'This is my personal public anonymous relfections that I added to the exercise etc etc etc etc etc',
    },
  },
];

const getDevUserEvents = ({userId}: {userId: string}) => [
  ...getCompletedSessions(userId),
  ...getFeedback(),
  ...getSharingPosts(),
];

export default getDevUserEvents;
