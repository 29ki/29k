import {useMemo} from 'react';
import {
  Exercise,
  ExerciseIntroPortalHostNote,
} from '../../../../../shared/src/types/generated/Exercise';
import {SessionSlideState} from './useLiveSessionSlideState';

const resolveNotes = (
  async?: boolean,
  hoseNotes?: ExerciseIntroPortalHostNote[],
) => {
  const createNotes = () =>
    hoseNotes?.filter(n => n.text).map(n => ({text: n.text}));
  const createAsyncNotes = () =>
    hoseNotes?.filter(n => n.asyncText).map(n => ({text: n.asyncText}));

  if (async) {
    if (hoseNotes?.find(n => n.asyncText !== undefined)) {
      return createAsyncNotes();
    }
    return createNotes();
  } else {
    if (hoseNotes?.find(n => n.text !== undefined)) {
      return createNotes();
    }
    return createAsyncNotes();
  }
};

const useResolveHostNotes = (
  introPortal: boolean | undefined,
  exercise: Exercise | null,
  slideState: SessionSlideState | null,
  async: boolean | undefined,
) => {
  return useMemo(() => {
    if (introPortal) {
      return resolveNotes(async, exercise?.introPortal?.hostNotes);
    }

    if (slideState?.current && 'hostNotes' in slideState?.current) {
      return resolveNotes(async, slideState?.current.hostNotes);
    }
  }, [async, exercise, introPortal, slideState]);
};

export default useResolveHostNotes;
