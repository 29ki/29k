import request from 'supertest';

import {userPropertiesRouter} from './index';
import createMockServer from '../lib/createMockServer';

import {createMetricsRouter} from '../../lib/routers';
import {setUserProperties} from '../../models/metrics';

jest.mock('../../models/metrics');

const mockSetUserProperties = jest.mocked(setUserProperties);

const router = createMetricsRouter();
router.use('/userProperties', userPropertiesRouter.routes());
const mockServer = createMockServer(router.routes(), router.allowedMethods());

afterEach(() => {
  jest.clearAllMocks();
});

afterAll(() => {
  mockServer.close();
});

describe('/api/userProperties', () => {
  describe('Success', () => {
    it('Accepts incoming events', async () => {
      const response = await request(mockServer)
        .post('/userProperties/123e4567-e89b-12d3-a456-426614174000')
        .send({
          'Some Property': 'Some Value',
        });

      expect(mockSetUserProperties).toHaveBeenCalledTimes(1);
      expect(mockSetUserProperties).toHaveBeenCalledWith(
        '123e4567-e89b-12d3-a456-426614174000',
        {
          'Some Property': 'Some Value',
        },
      );

      expect(response.status).toBe(200);
    });

    it('Accepts empty properties', async () => {
      const response = await request(mockServer).post(
        '/userProperties/123e4567-e89b-12d3-a456-426614174000',
      );

      expect(mockSetUserProperties).toHaveBeenCalledTimes(1);
      expect(mockSetUserProperties).toHaveBeenCalledWith(
        '123e4567-e89b-12d3-a456-426614174000',
        {},
      );

      expect(response.status).toBe(200);
    });
  });

  describe('Failure', () => {
    it('Requires a userId', async () => {
      const response = await request(mockServer).post('/userProperties');

      expect(mockSetUserProperties).toHaveBeenCalledTimes(0);

      expect(response.status).toBe(404);
    });

    it('Requires a valid userId', async () => {
      const response = await request(mockServer).post('/userProperties/foo');

      expect(mockSetUserProperties).toHaveBeenCalledTimes(0);

      expect(response.status).toBe(500);
    });

    it('Requires valid properties', async () => {
      const response = await request(mockServer)
        .post('/userProperties/123e4567-e89b-12d3-a456-426614174000')
        .send({foo: []});

      expect(mockSetUserProperties).toHaveBeenCalledTimes(0);

      expect(response.status).toBe(500);
    });
  });
});
