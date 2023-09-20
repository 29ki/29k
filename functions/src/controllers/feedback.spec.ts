import * as metricsModel from '../models/metrics';
import * as feedbackController from './feedback';
import * as slack from '../models/slack';
import {getExerciseById} from '../lib/exercise';
import {Exercise} from '../../../shared/src/types/generated/Exercise';
import {SessionMode, SessionType} from '../../../shared/src/schemas/Session';
import {Feedback} from '../../../shared/src/types/Feedback';

jest.mock('../models/metrics');
jest.mock('../models/slack');
jest.mock('../lib/exercise');

const mockAddFeedback = jest.mocked(metricsModel.addFeedback);

beforeEach(async () => {
  jest.clearAllMocks();
});

describe('feedback - controller', () => {
  describe('addFeedback', () => {
    it('saves feedback and posts to slack', async () => {
      jest.mocked(getExerciseById).mockReturnValueOnce({
        name: 'Some Exercise',
        card: {
          image: {
            source: 'https://some.image/url',
          },
        },
      } as Exercise);

      mockAddFeedback.mockResolvedValueOnce({
        id: 'feedback-id',
      } as Feedback);

      const feedback = {
        exerciseId: 'some-exercise-id',
        completed: true,
        question: 'Some question?',
        answer: true,
        comment: 'Some comment!',
        sessionId: 'session-id',
        sessionType: SessionType.public,
        sessionMode: SessionMode.live,
        params: {},
      };
      await feedbackController.addFeedback(feedback);

      expect(metricsModel.addFeedback).toHaveBeenCalledTimes(1);
      expect(metricsModel.addFeedback).toHaveBeenCalledWith({
        exerciseId: 'some-exercise-id',
        completed: true,
        answer: true,
        comment: 'Some comment!',
        question: 'Some question?',
        sessionId: 'session-id',
        sessionType: SessionType.public,
        sessionMode: SessionMode.live,
        params: {},
      });
      expect(slack.sendFeedbackMessage).toHaveBeenCalledTimes(1);
      expect(slack.sendFeedbackMessage).toHaveBeenCalledWith(
        'feedback-id',
        'Some Exercise',
        'https://some.image/url',
        'Some question?',
        true,
        'Some comment!',
        SessionType.public,
        SessionMode.live,
        false,
      );
    });

    it('does not post to slack if no comment is given', async () => {
      jest.mocked(getExerciseById).mockReturnValueOnce({
        name: 'Some Exercise',
        card: {
          image: {
            source: 'https://some.image/url',
          },
        },
      } as Exercise);

      const feedback = {
        exerciseId: 'some-exercise-id',
        completed: true,
        question: 'Some question?',
        answer: true,
        sessionId: 'session-id',
        sessionType: SessionType.public,
        sessionMode: SessionMode.live,
        params: {},
      };
      await feedbackController.addFeedback(feedback);

      expect(metricsModel.addFeedback).toHaveBeenCalledTimes(1);
      expect(metricsModel.addFeedback).toHaveBeenCalledWith({
        exerciseId: 'some-exercise-id',
        completed: true,
        answer: true,
        question: 'Some question?',
        sessionId: 'session-id',
        sessionType: SessionType.public,
        sessionMode: SessionMode.live,
        params: {},
      });
      expect(slack.sendFeedbackMessage).toHaveBeenCalledTimes(0);
    });
  });

  describe('getFeedbackCountByExercise', () => {
    it('should aggregate quantity of positive/negative feedbacks', async () => {
      jest
        .mocked(metricsModel.getFeedbackByExercise)
        .mockResolvedValue([
          {answer: true},
          {answer: true},
          {answer: true},
          {answer: false},
          {answer: false},
        ] as Feedback[]);
      const res = await feedbackController.getFeedbackCountByExercise(
        'exercise-id',
        SessionMode.live,
      );
      expect(metricsModel.getFeedbackByExercise).toHaveBeenCalledWith(
        'exercise-id',
        'live',
      );
      expect(res).toEqual({negative: 2, positive: 3});
    });
  });
});
