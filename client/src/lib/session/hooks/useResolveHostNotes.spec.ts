import {renderHook} from '@testing-library/react-hooks';
import {Exercise} from '../../../../../shared/src/types/generated/Exercise';
import useResolveHostNotes from './useResolveHostNotes';
import {SessionSlideState} from './useLiveSessionSlideState';

describe('useResolveHostNotes', () => {
  it('should return regular introPortal notes for live session', () => {
    const exercise = {
      introPortal: {
        hostNotes: [{text: 'some note'}, {text: 'some other note'}],
      },
    } as unknown as Exercise;
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
    const exercise = {} as unknown as Exercise;
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
