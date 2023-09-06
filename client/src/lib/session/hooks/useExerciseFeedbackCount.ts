import {useCallback, useEffect, useState} from 'react';

import {getFeedbackCountByExercise} from '../../sessions/api/session';
import {SessionMode} from '../../../../../shared/src/schemas/Session';

const useExerciseFeedbackCount = (exerciseId?: string, mode?: SessionMode) => {
  const [count, setCount] = useState<{
    positive: number;
    negative: number;
  } | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const fetchFeedbackCountForExercise = useCallback(async () => {
    if (exerciseId) {
      setLoading(true);
      const res = await getFeedbackCountByExercise(exerciseId, mode);
      setCount(res);
      setLoading(false);
    } else {
      setCount(null);
    }
  }, [exerciseId, mode]);

  useEffect(() => {
    fetchFeedbackCountForExercise();
  }, [exerciseId, fetchFeedbackCountForExercise]);

  return {
    count,
    loading,
  };
};

export default useExerciseFeedbackCount;
