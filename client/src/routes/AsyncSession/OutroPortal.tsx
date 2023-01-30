import {RouteProp, useRoute} from '@react-navigation/native';
import React from 'react';

import {Body12} from '../../lib/components/Typography/Body/Body';
import useExerciseById from '../../lib/content/hooks/useExerciseById';
import {AsyncSessionStackProps} from '../../lib/navigation/constants/routes';

const OutroPortal = () => {
  const {
    params: {session},
  } = useRoute<RouteProp<AsyncSessionStackProps, 'Session'>>();
  const exercise = useExerciseById(session.contentId);
  return <Body12>{exercise?.name}</Body12>;
};

export default OutroPortal;
