import * as metricsModel from '../models/metrics';
import {CreateFeedbackBody} from '../../../shared/src/types/Feedback';
import * as slack from '../models/slack';
import {getExerciseById} from '../lib/exercise';
import {SessionMode} from '../../../shared/src/schemas/Session';

export const addFeedback = async (feedback: CreateFeedbackBody) => {
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
      savedData.approved,
    );
  }
};

export const getFeedbackCountByExercise = async (
  exerciseId: string,
  mode?: SessionMode,
) => {
  const docs = await metricsModel.getFeedbackByExercise(exerciseId, mode);

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
  mode?: SessionMode,
) => metricsModel.getFeedbackByExercise(exerciseId, mode, true);
