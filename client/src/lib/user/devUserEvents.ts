const getCompletedSessions = (hostId: string) => [
  {
    type: 'completedSession',
    payload: {
      id: '10abff47-23d5-4587-9683-7c8df85c4d08',
      exerciseId: 'c5b1197a-4eec-4699-9dad-0e3d6323967b',
      language: 'en',
      type: 'public',
      mode: 'live',
      hostId,
    },
    timestamp: '2023-05-19T09:56:39.117Z',
  },
  {
    type: 'completedSession',
    payload: {
      id: '10abff47-23d5-4587-9683-7c8df85c4d09',
      exerciseId: '095f9642-73b6-4c9a-ae9a-ea7dea7363f5',
      language: 'en',
      type: 'private',
      mode: 'async',
    },
    timestamp: '2023-05-30T09:56:39.117Z',
  },
  {
    type: 'completedSession',
    payload: {
      id: '10abff47-23d5-4587-9683-7c8df85c4d10',
      exerciseId: '185889ec-753b-4e2c-8322-3004013e8a6e',
      language: 'en',
      type: 'public',
      mode: 'live',
    },
    timestamp: '2023-04-19T09:56:39.117Z',
  },
  {
    type: 'completedSession',
    payload: {
      id: '10abff47-23d5-4587-9683-7c8df85c4d11',
      exerciseId: '185889ec-753b-4e2c-8322-3004013e8a6e',
      language: 'en',
      type: 'private',
      mode: 'live',
      hostId,
    },
    timestamp: '2023-04-20T09:56:39.117Z',
  },
  {
    type: 'completedSession',
    payload: {
      id: '10abff47-23d5-4587-9683-7c8df85c4d12',
      exerciseId: '3188a5ed-a1d6-451c-ae2a-f44f4df37495',
      language: 'en',
      type: 'private',
      mode: 'live',
    },
    timestamp: '2023-06-19T09:56:39.117Z',
  },
  {
    type: 'completedSession',
    payload: {
      id: '10abff47-23d5-4587-9683-7c8df85c4d13',
      exerciseId: '185889ec-753b-4e2c-8322-3004013e8a6e',
      language: 'en',
      type: 'private',
      mode: 'async',
    },
    timestamp: '2023-06-30T09:56:39.117Z',
  },
];

const getFeedback = () => [
  {
    timestamp: '2023-06-30T09:56:39.117Z',
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
    timestamp: '2023-06-30T09:56:39.117Z',
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
    timestamp: '2023-06-30T09:56:39.117Z',
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
    timestamp: '2023-06-30T09:56:39.117Z',
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
    timestamp: '2023-06-30T09:56:39.117Z',
    type: 'feedback',
    payload: {
      question: 'Was this meaningful for you?',
      answer: true,
      comment: 'Loved it, felt heard and safe.',
      sessionId: '10abff47-23d5-4587-9683-7c8df85c4d12',
      exerciseId: '3188a5ed-a1d6-451c-ae2a-f44f4df37495',
    },
  },
];

const getSharingPosts = () => [
  {
    timestamp: '2023-06-30T09:56:39.117Z',
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
    timestamp: '2023-06-30T09:56:39.117Z',
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

export default ({userId}: {userId: string}) => ({
  completedSessions: getCompletedSessions(userId),
  feedback: getFeedback(),
  sharingPosts: getSharingPosts(),
});
