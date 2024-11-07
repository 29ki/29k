import {useMemo} from 'react';
import {ExerciseIntroPortalHostNote} from '../../../../../shared/src/types/generated/Exercise';
import {SessionSlideState} from './useLiveSessionSlideState';
import {ExerciseWithLanguage} from '../../content/types';

const resolveNotes = (hostNotes?: ExerciseIntroPortalHostNote[]) => {
  return hostNotes?.filter(n => n.text).map(n => ({text: n.text}));
};

const useResolveHostNotes = (
  introPortal: boolean | undefined,
  outroPortal: boolean | undefined,
  exercise: ExerciseWithLanguage | null,
  slideState: SessionSlideState | null,
) => {
  return useMemo(() => {
    if (introPortal) {
      return resolveNotes(
        exercise?.slides.find(slide => slide.type === 'host')?.hostNotes,
      );
    }

    if (outroPortal) {
      return resolveNotes(
        exercise?.slides.reverse().find(slide => slide.type === 'host')
          ?.hostNotes,
      );
    }

    if (outroPortal) {
      return resolveNotes(exercise?.introPortal?.hostNotes);
    }

    if (slideState?.current && 'hostNotes' in slideState?.current) {
      return resolveNotes(slideState?.current.hostNotes);
    }
  }, [exercise, introPortal, outroPortal, slideState]);
};

export default useResolveHostNotes;
