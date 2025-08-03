import {useCallback, useState} from 'react';
import {Feedback} from '../../../../../shared/src/types/Feedback';
import {fetchHostFeedback} from '../api/sessions';

const useHostFeedback = () => {
  const [feedback, setFeedback] = useState<Feedback[]>([]);

  const fetchFeedback = useCallback(async () => {
    setFeedback(await fetchHostFeedback(20));
  }, [setFeedback]);

  return {
    hostFeedback: feedback,
    fetchHostFeedback: fetchFeedback,
  };
};

export default useHostFeedback;
