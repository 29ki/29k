import {Timestamp} from 'firebase-admin/firestore';
import {mockFirebase} from 'firestore-jest-mock';

mockFirebase(
  {
    database: {
      'metrics-events': [],
    },
  },
  {
    includeIdsInData: false,
    mutable: true,
    simulateQueryFilters: false,
  },
);

import {
  mockAdd,
  mockCollection,
  mockDoc,
  mockGetTransaction,
  mockLimit,
  mockRunTransaction,
  mockSet,
  mockUpdate,
  mockWhere,
} from 'firestore-jest-mock/mocks/firestore';
import {SessionMode, SessionType} from '../../../shared/src/schemas/Session';
import {
  addFeedback,
  setFeedbackApproval,
  getFeedbackByExercise,
  logEvent,
  setUserProperties,
  getFeedbackBySessionIds,
} from './metrics';

afterEach(() => {
  jest.clearAllMocks();
});

describe('metrics model', () => {
  describe('logEvent', () => {
    it('inserts events into the metricsEvents collection', async () => {
      await logEvent(
        'some-user-id',
        new Date('2022-02-02T02:02:02Z'),
        'Some Event Name',
        {
          'Some Property': 'Some Value',
        },
      );

      expect(mockCollection).toHaveBeenCalledWith('metricsEvents');

      expect(mockAdd).toHaveBeenCalledTimes(1);
      expect(mockAdd).toHaveBeenCalledWith({
        event: 'Some Event Name',
        timestamp: expect.any(Timestamp),
        userId: 'some-user-id',
        properties: {
          'Some Property': 'Some Value',
        },
      });
    });

    it('accepts undefined properties', async () => {
      await logEvent(
        'some-user-id',
        new Date('2022-02-02T02:02:02Z'),
        'Some Event Name',
      );

      expect(mockCollection).toHaveBeenCalledWith('metricsEvents');

      expect(mockAdd).toHaveBeenCalledTimes(1);
      expect(mockAdd).toHaveBeenCalledWith({
        event: 'Some Event Name',
        timestamp: expect.any(Timestamp),
        userId: 'some-user-id',
        properties: {},
      });
    });
  });

  describe('setUserProperties', () => {
    it('updates metricsUserProperties collection', async () => {
      await setUserProperties('some-user-id', {
        'Some Property': 'Some Value',
      });

      expect(mockCollection).toHaveBeenCalledWith('metricsUserProperties');
      expect(mockDoc).toHaveBeenCalledWith('some-user-id');
      expect(mockSet).toHaveBeenCalledTimes(1);
      expect(mockSet).toHaveBeenCalledWith(
        {
          'Some Property': 'Some Value',
          updatedAt: expect.any(Timestamp),
        },
        {merge: true},
      );
    });

    it('supports setting properties once (idempotent)', async () => {
      mockGetTransaction.mockResolvedValueOnce({
        data: () => ({
          'Some Property': 'Some Value',
        }),
      });

      await setUserProperties(
        'some-user-id',
        {
          'Some Property': 'Some Other Value',
        },
        true,
      );

      expect(mockCollection).toHaveBeenCalledWith('metricsUserProperties');

      expect(mockRunTransaction).toHaveBeenCalledTimes(1);
      expect(mockSet).toHaveBeenCalledTimes(1);
      expect(mockSet).toHaveBeenCalledWith(
        {
          'Some Property': 'Some Value',
          updatedAt: expect.any(Timestamp),
        },
        {merge: true},
      );
    });

    it('accepts undefined properties', async () => {
      await setUserProperties('some-user-id');

      expect(mockCollection).toHaveBeenCalledWith('metricsUserProperties');

      expect(mockSet).toHaveBeenCalledTimes(1);
      expect(mockSet).toHaveBeenCalledWith(
        {
          updatedAt: expect.any(Timestamp),
        },
        {merge: true},
      );
    });
  });

  describe('addFeedback', () => {
    it('inserts feedback into metricsFeedback collection', async () => {
      const feedback = {
        exerciseId: 'some-exercise-id',
        completed: true,
        question: 'Some question?',
        answer: true,
        comment: 'Some comments!',
        sessionId: 'session-id',
        sessionType: SessionType.public,
        sessionMode: SessionMode.live,
        params: {},
      };
      const doc = await addFeedback(feedback);

      expect(mockCollection).toHaveBeenCalledWith('metricsFeedback');
      expect(mockAdd).toHaveBeenCalledTimes(1);
      expect(mockAdd).toHaveBeenCalledWith({
        exerciseId: 'some-exercise-id',
        completed: true,
        question: 'Some question?',
        answer: true,
        comment: 'Some comments!',
        sessionId: 'session-id',
        createdAt: expect.any(Timestamp),
        sessionType: SessionType.public,
        sessionMode: SessionMode.live,
        params: {},
      });

      expect(doc).toMatchObject({
        ...feedback,
        id: expect.any(String),
      });
    });
  });

  describe('getFeedbackByExercise', () => {
    it('queries feedback by exercise id only', async () => {
      await getFeedbackByExercise('exercise-id-123');

      expect(mockCollection).toHaveBeenCalledWith('metricsFeedback');
      expect(mockWhere).toHaveBeenCalledWith(
        'exerciseId',
        '==',
        'exercise-id-123',
      );
    });

    it('queries feedback by exercise id and mode', async () => {
      await getFeedbackByExercise(
        'exercise-id-123',
        undefined,
        SessionMode.live,
      );

      expect(mockCollection).toHaveBeenCalledWith('metricsFeedback');
      expect(mockWhere).toHaveBeenCalledWith(
        'exerciseId',
        '==',
        'exercise-id-123',
      );
      expect(mockWhere).toHaveBeenCalledWith('sessionMode', '==', 'live');
    });
  });

  describe('getFeedbackBySessionIds', () => {
    it('queries feedback by session Ids', async () => {
      await getFeedbackBySessionIds([
        'some-session-id',
        'some-other-session-id',
      ]);

      expect(mockCollection).toHaveBeenCalledWith('metricsFeedback');
      expect(mockWhere).toHaveBeenCalledWith('sessionId', 'in', [
        'some-session-id',
        'some-other-session-id',
      ]);
      expect(mockWhere).toHaveBeenCalledWith('host', '!=', true);
    });

    it('supports limiting query result', async () => {
      await getFeedbackBySessionIds(
        ['some-session-id', 'some-other-session-id'],
        20,
      );

      expect(mockLimit).toHaveBeenCalledWith(20);
    });

    it("limits session id's if it's more than 30", async () => {
      await getFeedbackBySessionIds([
        'some-session-id-1',
        'some-session-id-2',
        'some-session-id-3',
        'some-session-id-4',
        'some-session-id-5',
        'some-session-id-6',
        'some-session-id-7',
        'some-session-id-8',
        'some-session-id-9',
        'some-session-id-10',
        'some-session-id-11',
        'some-session-id-12',
        'some-session-id-13',
        'some-session-id-14',
        'some-session-id-15',
        'some-session-id-16',
        'some-session-id-17',
        'some-session-id-18',
        'some-session-id-19',
        'some-session-id-20',
        'some-session-id-21',
        'some-session-id-22',
        'some-session-id-23',
        'some-session-id-24',
        'some-session-id-25',
        'some-session-id-26',
        'some-session-id-27',
        'some-session-id-28',
        'some-session-id-29',
        'some-session-id-30',
        'some-session-id-31',
        'some-session-id-32',
        'some-session-id-33',
        'some-session-id-34',
        'some-session-id-35',
        'some-session-id-36',
        'some-session-id-37',
        'some-session-id-38',
        'some-session-id-39',
      ]);

      expect(mockCollection).toHaveBeenCalledWith('metricsFeedback');
      expect(mockWhere).toHaveBeenCalledWith('sessionId', 'in', [
        'some-session-id-1',
        'some-session-id-2',
        'some-session-id-3',
        'some-session-id-4',
        'some-session-id-5',
        'some-session-id-6',
        'some-session-id-7',
        'some-session-id-8',
        'some-session-id-9',
        'some-session-id-10',
        'some-session-id-11',
        'some-session-id-12',
        'some-session-id-13',
        'some-session-id-14',
        'some-session-id-15',
        'some-session-id-16',
        'some-session-id-17',
        'some-session-id-18',
        'some-session-id-19',
        'some-session-id-20',
        'some-session-id-21',
        'some-session-id-22',
        'some-session-id-23',
        'some-session-id-24',
        'some-session-id-25',
        'some-session-id-26',
        'some-session-id-27',
        'some-session-id-28',
        'some-session-id-29',
        'some-session-id-30',
      ]);
    });
  });

  describe('setFeedbackApproval', () => {
    it('updates feedback to approved', async () => {
      await setFeedbackApproval('feedback-id', true);
      expect(mockCollection).toHaveBeenCalledWith('metricsFeedback');
      expect(mockUpdate).toHaveBeenCalledTimes(1);
      expect(mockUpdate).toHaveBeenCalledWith({
        approved: true,
        updatedAt: expect.any(Timestamp),
      });
    });
  });
});
