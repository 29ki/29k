import {useCallback, useEffect, useState} from 'react';

import {getExerciseRating} from '../../sessions/api/session';
import {SessionMode} from '../../../../../shared/src/schemas/Session';

const useExerciseRating = (exerciseId?: string, mode?: SessionMode) => {
  const [rating, setRating] = useState<{
    positive: number;
    negative: number;
  } | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const fetchRating = useCallback(async () => {
    if (exerciseId) {
      setLoading(true);
      const res = await getExerciseRating(exerciseId, mode);
      setRating(res);
      setLoading(false);
    } else {
      setRating(null);
    }
  }, [exerciseId, mode]);

  useEffect(() => {
    fetchRating();
  }, [exerciseId, fetchRating]);

  return {
    rating,
    loading,
  };
};

export default useExerciseRating;
