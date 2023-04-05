import request from 'supertest';

import {feedbackRouter} from './index';
import createMockServer from '../lib/createMockServer';

import {createMetricsRouter} from '../../lib/routers';
import {addFeedback} from '../../controllers/feedback';
import {SessionMode, SessionType} from '../../../../shared/src/types/Session';

jest.mock('../../controllers/feedback');

const router = createMetricsRouter();
router.use('/logFeedback', feedbackRouter.routes());
const mockServer = createMockServer(router.routes(), router.allowedMethods());

afterEach(() => {
  jest.clearAllMocks();
});

afterAll(() => {
  mockServer.close();
});

describe('/metrics/logFeedback', () => {
  describe('Success', () => {
    it('Accepts incoming feedback', async () => {
      const response = await request(mockServer).post('/logFeedback').send({
        exerciseId: 'some-exercise-id',
        completed: true,
        sessionId: 'some-session-id',
        host: false,
        question: 'Some question?',
        answer: true,
        comment: 'Some comment!',
        sessionType: SessionType.public,
        sessionMode: SessionMode.live,
      });

      expect(addFeedback).toHaveBeenCalledTimes(1);
      expect(addFeedback).toHaveBeenCalledWith({
        exerciseId: 'some-exercise-id',
        completed: true,
        sessionId: 'some-session-id',
        host: false,
        question: 'Some question?',
        answer: true,
        comment: 'Some comment!',
        sessionType: SessionType.public,
        sessionMode: SessionMode.live,
      });

      expect(response.status).toBe(200);
    });

    it('Accepts undefined host and comment', async () => {
      const response = await request(mockServer).post('/logFeedback').send({
        sessionId: 'some-session-id',
        exerciseId: 'some-exercise-id',
        completed: true,
        question: 'Some question?',
        answer: true,
        sessionType: SessionType.public,
        sessionMode: SessionMode.live,
      });

      expect(addFeedback).toHaveBeenCalledTimes(1);
      expect(addFeedback).toHaveBeenCalledWith({
        sessionId: 'some-session-id',
        exerciseId: 'some-exercise-id',
        completed: true,
        question: 'Some question?',
        answer: true,
        sessionType: SessionType.public,
        sessionMode: SessionMode.live,
      });

      expect(response.status).toBe(200);
    });
  });

  describe('Failure', () => {
    it('Requires exerciseId', async () => {
      const response = await request(mockServer).post('/logFeedback').send({
        completed: true,
        question: 'Some question?',
        answer: true,
      });

      expect(addFeedback).toHaveBeenCalledTimes(0);

      expect(response.status).toBe(500);
    });

    it('Requires completed', async () => {
      const response = await request(mockServer).post('/logFeedback').send({
        exerciseId: 'some-exercise-id',
        question: 'Some question?',
        answer: true,
      });

      expect(addFeedback).toHaveBeenCalledTimes(0);

      expect(response.status).toBe(500);
    });

    it('Requires question', async () => {
      const response = await request(mockServer).post('/logFeedback').send({
        exerciseId: 'some-exercise-id',
        completed: true,
        answer: true,
      });

      expect(addFeedback).toHaveBeenCalledTimes(0);

      expect(response.status).toBe(500);
    });

    it('Requires answer', async () => {
      const response = await request(mockServer).post('/logFeedback').send({
        exerciseId: 'some-exercise-id',
        completed: true,
        question: 'Some question?',
      });

      expect(addFeedback).toHaveBeenCalledTimes(0);

      expect(response.status).toBe(500);
    });

    it('Requires sessionType', async () => {
      const response = await request(mockServer).post('/logFeedback').send({
        sessionId: 'some-session-id',
        exerciseId: 'some-exercise-id',
        completed: true,
        question: 'Some question?',
        answer: true,
        sessionMode: SessionMode.live,
      });

      expect(addFeedback).toHaveBeenCalledTimes(0);

      expect(response.status).toBe(500);
    });

    it('Requires sessionMode', async () => {
      const response = await request(mockServer).post('/logFeedback').send({
        sessionId: 'some-session-id',
        exerciseId: 'some-exercise-id',
        completed: true,
        question: 'Some question?',
        answer: true,
        sessionType: SessionType.public,
      });

      expect(addFeedback).toHaveBeenCalledTimes(0);

      expect(response.status).toBe(500);
    });
  });
});
