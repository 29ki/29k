'use client';

import {useEffect, useMemo} from 'react';
import styled from 'styled-components';
import useSessionState from '../../../../../client/src/lib/session/state/state';
import useExerciseById from '../../../../../client/src/lib/content/hooks/useExerciseById';
import {
  AsyncSessionType,
  SessionMode,
  SessionType,
} from '../../../../../shared/src/schemas/Session';
import dayjs from 'dayjs';
import {LANGUAGE_TAG} from '../../../../../shared/src/i18n/constants';
import IntroPortal from '../../../../../client/src/routes/screens/AsyncSession/IntroPortal';
import {SafeAreaProvider} from 'react-native-safe-area-context';

const Wrapper = styled.div({
  height: '100%',
  width: '100%',
  maxWidth: 600,
  margin: '0 auto',
});

export default function ExercisePage({
  params: {language, exerciseId},
}: {
  params: {language: LANGUAGE_TAG; exerciseId: string};
}) {
  const setAsyncSession = useSessionState(state => state.setAsyncSession);
  const setExercise = useSessionState(state => state.setExercise);
  const exercise = useExerciseById(exerciseId);
  const session = useMemo(
    () => ({
      type: SessionType.public,
      mode: SessionMode.async,
      id: 'wip',
      startTime: dayjs().toISOString(),
      exerciseId: exerciseId,
      language: language,
    }),
    [exerciseId, language],
  ) as AsyncSessionType;

  useEffect(() => {
    setAsyncSession(session);
    setExercise(exercise);
  }, [exercise, session, setAsyncSession, setExercise]);

  return (
    <SafeAreaProvider>
      <Wrapper>
        <IntroPortal session={session} />
      </Wrapper>
    </SafeAreaProvider>
  );
}
