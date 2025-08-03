import * as metricsModel from '../models/metrics';
import * as sessionModel from '../models/session';
import * as feedbackController from './feedback';
import * as slack from '../models/slack';
import {getExerciseById} from '../lib/exercise';
import {Exercise} from '../../../shared/src/types/generated/Exercise';
import {SessionMode, SessionType} from '../../../shared/src/schemas/Session';
import {Feedback} from '../../../shared/src/types/Feedback';
import {LANGUAGE_TAG} from '../lib/i18n';
import {LiveSessionRecord} from '../models/types/types';

jest.mock('../models/metrics');
jest.mock('../models/session');
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
        language: 'sv' as LANGUAGE_TAG,
      };
      await feedbackController.addFeedback(feedback);

      expect(metricsModel.addFeedback).toHaveBeenCalledTimes(1);
      expect(metricsModel.addFeedback).toHaveBeenCalledWith({
        exerciseId: 'some-exercise-id',
        language: 'sv',
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
        {},
        'sv',
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
        undefined,
        'live',
      );
      expect(res).toEqual({negative: 2, positive: 3});
    });
  });

  describe('getApprovedFeedbackByExercise', () => {
    it('returns approved feedback', async () => {
      jest.mocked(metricsModel.getFeedbackByExercise).mockResolvedValue([
        {
          id: 'some-id',
          approved: true,
        },
        {
          id: 'some-other-id',
          approved: true,
        },
      ] as Feedback[]);
      const res = await feedbackController.getApprovedFeedbackByExercise(
        'exercise-id',
        undefined,
        SessionMode.live,
      );
      expect(metricsModel.getFeedbackByExercise).toHaveBeenCalledTimes(1);
      expect(metricsModel.getFeedbackByExercise).toHaveBeenCalledWith(
        'exercise-id',
        undefined,
        'live',
        true,
        undefined,
      );
      expect(res).toEqual([
        {
          id: 'some-id',
          approved: true,
        },
        {
          id: 'some-other-id',
          approved: true,
        },
      ]);
    });

    it('should optionally filter and sort by languages', async () => {
      jest.mocked(metricsModel.getFeedbackByExercise).mockResolvedValue([
        {
          id: 'some-id',
          approved: true,
          language: 'en',
        },
        {
          id: 'some-other-id',
          approved: true,
          language: 'sv',
        },
        {
          id: 'some-third-id',
          approved: true,
          language: 'sv',
        },
      ] as Feedback[]);
      const res = await feedbackController.getApprovedFeedbackByExercise(
        'exercise-id',
        ['sv', 'en'],
        SessionMode.live,
      );
      expect(metricsModel.getFeedbackByExercise).toHaveBeenCalledTimes(1);
      expect(metricsModel.getFeedbackByExercise).toHaveBeenCalledWith(
        'exercise-id',
        ['sv', 'en'],
        'live',
        true,
        undefined,
      );
      expect(res).toEqual([
        {
          id: 'some-other-id',
          approved: true,
          language: 'sv',
        },
        {
          id: 'some-third-id',
          approved: true,
          language: 'sv',
        },
        {
          id: 'some-id',
          approved: true,
          language: 'en',
        },
      ]);
    });
  });

  describe('getSessionsFeedbackByHostId', () => {
    it('returns sessions feedback for a host', async () => {
      jest.mocked(sessionModel.getSessionsByHostId).mockResolvedValue([
        {
          id: 'some-session-id',
        },
        {
          id: 'some-other-session-id',
        },
      ] as LiveSessionRecord[]);

      jest.mocked(metricsModel.getFeedbackBySessionIds).mockResolvedValue([
        {
          sessionId: 'some-session-id',
          comment: 'Some feedback comment',
        },
        {
          sessionId: 'some-other-session-id',
          comment: 'Some other feedback comment',
        },
      ] as Feedback[]);

      const res = await feedbackController.getSessionsFeedbackByHostId(
        'some-host-id',
        20,
      );

      expect(sessionModel.getSessionsByHostId).toHaveBeenCalledTimes(1);
      expect(sessionModel.getSessionsByHostId).toHaveBeenCalledWith(
        'some-host-id',
      );

      expect(metricsModel.getFeedbackBySessionIds).toHaveBeenCalledTimes(1);
      expect(metricsModel.getFeedbackBySessionIds).toHaveBeenCalledWith(
        ['some-session-id', 'some-other-session-id'],
        20,
      );

      expect(res).toEqual([
        {
          sessionId: 'some-session-id',
          comment: 'Some feedback comment',
        },
        {
          sessionId: 'some-other-session-id',
          comment: 'Some other feedback comment',
        },
      ]);
    });

    it('returns empty array if user has no sessions', async () => {
      jest
        .mocked(sessionModel.getSessionsByHostId)
        .mockResolvedValue([] as LiveSessionRecord[]);

      const res = await feedbackController.getSessionsFeedbackByHostId(
        'some-host-id',
        20,
      );

      expect(sessionModel.getSessionsByHostId).toHaveBeenCalledTimes(1);
      expect(sessionModel.getSessionsByHostId).toHaveBeenCalledWith(
        'some-host-id',
      );

      expect(metricsModel.getFeedbackBySessionIds).toHaveBeenCalledTimes(0);

      expect(res).toEqual([]);
    });
  });
});
