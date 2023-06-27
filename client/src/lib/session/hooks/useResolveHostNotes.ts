import {useMemo} from 'react';
import {
  Exercise,
  ExerciseIntroPortalHostNote,
} from '../../../../../shared/src/types/generated/Exercise';
import {SessionSlideState} from './useLiveSessionSlideState';

const resolveNotes = (hoseNotes?: ExerciseIntroPortalHostNote[]) => {
  return hoseNotes?.filter(n => n.text).map(n => ({text: n.text}));
};

const useResolveHostNotes = (
  introPortal: boolean | undefined,
  exercise: Exercise | null,
  slideState: SessionSlideState | null,
) => {
  return useMemo(() => {
    if (introPortal) {
      return resolveNotes(exercise?.introPortal?.hostNotes);
    }

    if (slideState?.current && 'hostNotes' in slideState?.current) {
      return resolveNotes(slideState?.current.hostNotes);
    }
  }, [exercise, introPortal, slideState]);
};

export default useResolveHostNotes;
