import {Timestamp} from 'firebase-admin/firestore';
import {mockFirebase} from 'firestore-jest-mock';

mockFirebase(
  {
    database: {
      'metrics-events': [],
    },
  },
  {includeIdsInData: false, mutable: true},
);

import {
  mockAdd,
  mockCollection,
  mockDoc,
  mockSet,
} from 'firestore-jest-mock/mocks/firestore';
import {addFeedback, logEvent, setUserProperties} from './metrics';

afterEach(() => {
  jest.clearAllMocks();
});

describe('metrics model', () => {
  describe('logEvent', () => {
    it('Inserts events into the metricsEvents collection', async () => {
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

    it('Accepts undefined properties', async () => {
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
    it('Updates metricsUserProperties collection', async () => {
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

    it('Accepts undefined properties', async () => {
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
    it('Inserts feedback into metricsFeedback collection', async () => {
      const feedback = {
        exerciseId: 'some-exercise-id',
        completed: true,
        question: 'Some question?',
        answer: true,
        comment: 'Some comments!',
      };
      await addFeedback(feedback);

      expect(mockCollection).toHaveBeenCalledWith('metricsFeedback');
      expect(mockAdd).toHaveBeenCalledTimes(1);
      expect(mockAdd).toHaveBeenCalledWith({
        exerciseId: 'some-exercise-id',
        completed: true,
        question: 'Some question?',
        answer: true,
        comment: 'Some comments!',
        createdAt: expect.any(Timestamp),
      });
    });
  });
});
