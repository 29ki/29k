import request from 'supertest';

import {logEventRouter} from './index';
import createMockServer from '../lib/createMockServer';

import {createMetricsRouter} from '../../lib/routers';
import {logEvent} from '../../models/metrics';

jest.mock('../../models/metrics');

const mockLogEvent = jest.mocked(logEvent);

const router = createMetricsRouter();
router.use('/logEvent', logEventRouter.routes());
const mockServer = createMockServer(router.routes(), router.allowedMethods());

afterEach(() => {
  jest.clearAllMocks();
});

afterAll(() => {
  mockServer.close();
});

describe('/metrics/logEvent', () => {
  describe('Success', () => {
    it('Accepts incoming events', async () => {
      const response = await request(mockServer)
        .post('/logEvent/123e4567-e89b-12d3-a456-426614174000')
        .send({
          timestamp: '2022-02-02T02:02:02Z',
          event: 'Some Event',
          properties: {
            'Some Property': 'Some Value',
          },
        });

      expect(mockLogEvent).toHaveBeenCalledTimes(1);
      expect(mockLogEvent).toHaveBeenCalledWith(
        '123e4567-e89b-12d3-a456-426614174000',
        new Date('2022-02-02T02:02:02Z'),
        'Some Event',
        {
          'Some Property': 'Some Value',
        },
      );

      expect(response.status).toBe(200);
    });

    it('Accepts empty properties', async () => {
      const response = await request(mockServer)
        .post('/logEvent/123e4567-e89b-12d3-a456-426614174000')
        .send({
          timestamp: '2022-02-02T02:02:02Z',
          event: 'Some Event',
        });

      expect(mockLogEvent).toHaveBeenCalledTimes(1);
      expect(mockLogEvent).toHaveBeenCalledWith(
        '123e4567-e89b-12d3-a456-426614174000',
        new Date('2022-02-02T02:02:02Z'),
        'Some Event',
        undefined,
      );

      expect(response.status).toBe(200);
    });
  });

  describe('Failure', () => {
    it('Requires userId', async () => {
      const response = await request(mockServer).post('/logEvent').send({
        timestamp: '2022-02-02T02:02:02Z',
        event: 'Some Event',
      });

      expect(mockLogEvent).toHaveBeenCalledTimes(0);

      expect(response.status).toBe(404);
    });

    it('Requires a valie userId', async () => {
      const response = await request(mockServer).post('/logEvent/foo').send({
        timestamp: '2022-02-02T02:02:02Z',
        event: 'Some Event',
      });

      expect(mockLogEvent).toHaveBeenCalledTimes(0);

      expect(response.status).toBe(500);
    });

    it('Requires event', async () => {
      const response = await request(mockServer)
        .post('/logEvent/123e4567-e89b-12d3-a456-426614174000')
        .send({
          timestamp: '2022-02-02T02:02:02Z',
        });

      expect(mockLogEvent).toHaveBeenCalledTimes(0);

      expect(response.status).toBe(500);
    });

    it('Requires timestamp', async () => {
      const response = await request(mockServer)
        .post('/logEvent/123e4567-e89b-12d3-a456-426614174000')
        .send({
          event: 'Some Event',
        });

      expect(mockLogEvent).toHaveBeenCalledTimes(0);

      expect(response.status).toBe(500);
    });

    it('Requires a valid timestamp', async () => {
      const response = await request(mockServer)
        .post('/logEvent/123e4567-e89b-12d3-a456-426614174000')
        .send({
          timestamp: 'foo',
          event: 'Some Event',
        });

      expect(mockLogEvent).toHaveBeenCalledTimes(0);

      expect(response.status).toBe(500);
    });

    it('Requires valid properties', async () => {
      const response = await request(mockServer)
        .post('/logEvent/123e4567-e89b-12d3-a456-426614174000')
        .send({
          timestamp: '2022-02-02T02:02:02Z',
          event: 'Some Event',
          properties: 'string',
        });

      expect(mockLogEvent).toHaveBeenCalledTimes(0);

      expect(response.status).toBe(500);
    });
  });
});
