import {useCallback, useEffect, useState} from 'react';

import {getFeedbackByExercise} from '../../sessions/api/session';
import {SessionMode} from '../../../../../shared/src/schemas/Session';
import {Feedback} from '../../../../../shared/src/types/Feedback';

const useExerciseFeedback = (exerciseId?: string, mode?: SessionMode) => {
  const [feedback, setFeedback] = useState<Feedback[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const fetchFeedbackByExercise = useCallback(async () => {
    if (exerciseId) {
      setLoading(true);
      const res = await getFeedbackByExercise(exerciseId, mode);
      setFeedback(res);
      setLoading(false);
    } else {
      setFeedback([]);
    }
  }, [exerciseId, mode]);

  useEffect(() => {
    fetchFeedbackByExercise();
  }, [exerciseId, fetchFeedbackByExercise]);

  return {
    feedback,
    loading,
  };
};

export default useExerciseFeedback;
