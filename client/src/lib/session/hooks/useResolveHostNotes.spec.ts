import {renderHook} from '@testing-library/react-hooks';
import useResolveHostNotes from './useResolveHostNotes';
import {SessionSlideState} from './useLiveSessionSlideState';
import {ExerciseWithLanguage} from '../../content/types';

describe('useResolveHostNotes', () => {
  it('should return regular introPortal notes for live session', () => {
    const exercise = {
      introPortal: {
        hostNotes: [{text: 'some note'}, {text: 'some other note'}],
      },
    } as ExerciseWithLanguage;
    const slideState = {
      current: {
        hostNotes: [],
      },
    } as unknown as SessionSlideState;

    const {result} = renderHook(() =>
      useResolveHostNotes(true, exercise, slideState),
    );

    expect(result.current).toEqual([
      {text: 'some note'},
      {text: 'some other note'},
    ]);
  });

  it('should return regular notes for live session', () => {
    const exercise = {} as ExerciseWithLanguage;
    const slideState = {
      current: {
        hostNotes: [{text: 'some note'}, {text: 'some other note'}],
      },
    } as SessionSlideState;

    const {result} = renderHook(() =>
      useResolveHostNotes(false, exercise, slideState),
    );

    expect(result.current).toEqual([
      {text: 'some note'},
      {text: 'some other note'},
    ]);
  });
});
