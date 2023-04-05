import * as metricsModel from '../models/metrics';
import {Feedback} from '../../../shared/src/types/Feedback';
import * as slack from '../models/slack';
import {getExerciseById} from '../lib/exercise';

export const addFeedback = async (feedback: Feedback) => {
  await metricsModel.addFeedback(feedback);

  if (feedback.comment) {
    const exercise = getExerciseById(feedback.exerciseId);

    await slack.sendFeedbackMessage(
      exercise?.name,
      exercise?.card?.image?.source,
      feedback.question,
      feedback.answer,
      feedback.comment,
      feedback.sessionType,
      feedback.sessionMode,
    );
  }
};
