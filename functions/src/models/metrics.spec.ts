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
  mockUpdate,
} from 'firestore-jest-mock/mocks/firestore';
import {logEvent, setUserProperties} from './metrics';

afterEach(() => {
  jest.clearAllMocks();
});

describe('metrics model', () => {
  describe('logEvent', () => {
    it('Inserts events into the metrics-events collection', async () => {
      await logEvent(
        'some-user-id',
        new Date('2022-02-02T02:02:02Z'),
        'Some Event Name',
        {
          'Some Property': 'Some Value',
        },
      );

      expect(mockCollection).toHaveBeenCalledWith('metrics-events');

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

      expect(mockCollection).toHaveBeenCalledWith('metrics-events');

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
    it('Updates metrics-user-properties collection', async () => {
      await setUserProperties('some-user-id', {
        'Some Property': 'Some Value',
      });

      expect(mockCollection).toHaveBeenCalledWith('metrics-user-properties');
      expect(mockDoc).toHaveBeenCalledWith('some-user-id');
      expect(mockUpdate).toHaveBeenCalledTimes(1);
      expect(mockUpdate).toHaveBeenCalledWith({
        'Some Property': 'Some Value',
        updatedAt: expect.any(Timestamp),
      });
    });

    it('Accepts undefined properties', async () => {
      await setUserProperties('some-user-id');

      expect(mockCollection).toHaveBeenCalledWith('metrics-user-properties');

      expect(mockUpdate).toHaveBeenCalledTimes(1);
      expect(mockUpdate).toHaveBeenCalledWith({
        updatedAt: expect.any(Timestamp),
      });
    });
  });
});
