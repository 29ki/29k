import * as metricsModel from '../models/metrics';
import * as feedbackController from './feedback';
import * as slack from '../models/slack';
import {getExerciseById} from '../lib/exercise';
import {Exercise} from '../../../shared/src/types/generated/Exercise';
import {SessionMode, SessionType} from '../../../shared/src/types/Session';

jest.mock('../models/metrics');
jest.mock('../models/slack');
jest.mock('../lib/exercise');

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

      const feedback = {
        exerciseId: 'some-exercise-id',
        completed: true,
        question: 'Some question?',
        answer: true,
        comment: 'Some comment!',
        sessionId: 'session-id',
        sessionType: SessionType.public,
        sessionMode: SessionMode.live,
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
      });
      expect(slack.sendFeedbackMessage).toHaveBeenCalledTimes(1);
      expect(slack.sendFeedbackMessage).toHaveBeenCalledWith(
        'Some Exercise',
        'https://some.image/url',
        'Some question?',
        true,
        'Some comment!',
        SessionType.public,
        SessionMode.live,
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
      });
      expect(slack.sendFeedbackMessage).toHaveBeenCalledTimes(0);
    });
  });
});
