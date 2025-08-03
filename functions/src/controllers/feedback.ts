import * as metricsModel from '../models/metrics';
import * as sessionModel from '../models/session';
import {AddFeedbackBody} from '../../../shared/src/types/Feedback';
import * as slack from '../models/slack';
import {getExerciseById} from '../lib/exercise';
import {SessionMode} from '../../../shared/src/schemas/Session';
import {DEFAULT_LANGUAGE_TAG, LANGUAGE_TAG} from '../lib/i18n';

export const addFeedback = async (feedback: AddFeedbackBody) => {
  const savedData = await metricsModel.addFeedback(feedback);

  if (feedback.comment) {
    const exercise = getExerciseById(feedback.exerciseId);

    await slack.sendFeedbackMessage(
      savedData.id,
      exercise?.name,
      exercise?.card?.image?.source,
      feedback.question,
      feedback.answer,
      feedback.comment,
      feedback.sessionType,
      feedback.sessionMode,
      Boolean(savedData.approved),
      feedback.params,
      feedback.language || DEFAULT_LANGUAGE_TAG,
    );
  }
};

export const getFeedbackCountByExercise = async (
  exerciseId: string,
  mode?: SessionMode,
) => {
  const docs = await metricsModel.getFeedbackByExercise(
    exerciseId,
    undefined,
    mode,
  );

  return docs.reduce(
    (agg, feedback) => ({
      ...agg,
      ...(feedback.answer
        ? {positive: agg.positive + 1}
        : {negative: agg.negative + 1}),
    }),
    {positive: 0, negative: 0},
  );
};

export const getApprovedFeedbackByExercise = async (
  exerciseId: string,
  languages?: LANGUAGE_TAG[],
  mode?: SessionMode,
  limit?: number,
) => {
  const feedback = await metricsModel.getFeedbackByExercise(
    exerciseId,
    languages,
    mode,
    true,
    limit,
  );
  const sortedFeedback = feedback.sort((feedbackA, feedbackB) =>
    languages
      ? languages.findIndex(language => language === feedbackA.language) -
        languages.findIndex(language => language === feedbackB.language)
      : 0,
  );

  return sortedFeedback;
};

export const getSessionsFeedbackByHostId = async (
  hostId: string,
  limit?: number,
) => {
  const sessions = await sessionModel.getSessionsByHostId(hostId);

  if (!sessions.length) {
    return [];
  }

  const sessionIds = sessions.map(session => session.id);
  const feedback = await metricsModel.getFeedbackBySessionIds(
    sessionIds,
    limit,
  );

  return feedback;
};
