import request from 'supertest';

import {feedbackRouter} from './index';
import createMockServer from '../lib/createMockServer';

import {createMetricsRouter} from '../../lib/routers';
import {addFeedback} from '../../controllers/feedback';

jest.mock('../../controllers/feedback');

const router = createMetricsRouter();
router.use('/feedback', feedbackRouter.routes());
const mockServer = createMockServer(router.routes(), router.allowedMethods());

afterEach(() => {
  jest.clearAllMocks();
});

afterAll(() => {
  mockServer.close();
});

describe('/metrics/feedback', () => {
  describe('Success', () => {
    it('Accepts incoming feedback', async () => {
      const response = await request(mockServer).post('/feedback').send({
        exerciseId: 'some-exercise-id',
        question: 'Some question?',
        answer: true,
        comment: 'Some comment!',
      });

      expect(addFeedback).toHaveBeenCalledTimes(1);
      expect(addFeedback).toHaveBeenCalledWith({
        exerciseId: 'some-exercise-id',
        question: 'Some question?',
        answer: true,
        comment: 'Some comment!',
      });

      expect(response.status).toBe(200);
    });

    it('Accepts undefined comment', async () => {
      const response = await request(mockServer).post('/feedback').send({
        exerciseId: 'some-exercise-id',
        question: 'Some question?',
        answer: true,
      });

      expect(addFeedback).toHaveBeenCalledTimes(1);
      expect(addFeedback).toHaveBeenCalledWith({
        exerciseId: 'some-exercise-id',
        question: 'Some question?',
        answer: true,
      });

      expect(response.status).toBe(200);
    });
  });

  describe('Failure', () => {
    it('Requires exerciseId', async () => {
      const response = await request(mockServer).post('/feedback').send({
        question: 'Some question?',
        answer: true,
      });

      expect(addFeedback).toHaveBeenCalledTimes(0);

      expect(response.status).toBe(500);
    });

    it('Requires question', async () => {
      const response = await request(mockServer).post('/feedback').send({
        exerciseId: 'some-exercise-id',
        answer: true,
      });

      expect(addFeedback).toHaveBeenCalledTimes(0);

      expect(response.status).toBe(500);
    });

    it('Requires answer', async () => {
      const response = await request(mockServer).post('/feedback').send({
        exerciseId: 'some-exercise-id',
        question: 'Some question?',
      });

      expect(addFeedback).toHaveBeenCalledTimes(0);

      expect(response.status).toBe(500);
    });
  });
});
