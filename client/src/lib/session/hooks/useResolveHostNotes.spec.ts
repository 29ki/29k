import {renderHook} from '@testing-library/react-hooks';
import {Exercise} from '../../../../../shared/src/types/generated/Exercise';
import useResolveHostNotes from './useResolveHostNotes';
import {SessionSlideState} from './useLiveSessionSlideState';

describe('useResolveHostNotes', () => {
  it('should return regular introPortal notes for live session', () => {
    const exercise = {
      introPortal: {
        hostNotes: [
          {text: 'some note', asyncText: 'some async note'},
          {text: 'some other note', asyncText: 'some other async note'},
        ],
      },
    } as unknown as Exercise;
    const slideState = {
      current: {
        hostNotes: [],
      },
    } as unknown as SessionSlideState;

    const {result} = renderHook(() =>
      useResolveHostNotes(true, exercise, slideState, false),
    );

    expect(result.current).toEqual([
      {text: 'some note'},
      {text: 'some other note'},
    ]);
  });

  it('should fallback to async introPortal notes for live session', () => {
    const exercise = {
      introPortal: {
        hostNotes: [
          {asyncText: 'some async note'},
          {asyncText: 'some other async note'},
        ],
      },
    } as unknown as Exercise;
    const slideState = {
      current: {
        hostNotes: [],
      },
    } as unknown as SessionSlideState;

    const {result} = renderHook(() =>
      useResolveHostNotes(true, exercise, slideState, false),
    );

    expect(result.current).toEqual([
      {text: 'some async note'},
      {text: 'some other async note'},
    ]);
  });

  it('should return async introPortal notes for async session', () => {
    const exercise = {
      introPortal: {
        hostNotes: [
          {text: 'some note', asyncText: 'some async note'},
          {text: 'some other note', asyncText: 'some other async note'},
        ],
      },
    } as unknown as Exercise;
    const slideState = {
      current: {
        hostNotes: [],
      },
    } as unknown as SessionSlideState;

    const {result} = renderHook(() =>
      useResolveHostNotes(true, exercise, slideState, true),
    );

    expect(result.current).toEqual([
      {text: 'some async note'},
      {text: 'some other async note'},
    ]);
  });

  it('should fallback to regualar introPortal notes for async session', () => {
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
      useResolveHostNotes(true, exercise, slideState, true),
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
        hostNotes: [
          {text: 'some note', asyncText: 'some async note'},
          {text: 'some other note', asyncText: 'some other async note'},
        ],
      },
    } as SessionSlideState;

    const {result} = renderHook(() =>
      useResolveHostNotes(false, exercise, slideState, false),
    );

    expect(result.current).toEqual([
      {text: 'some note'},
      {text: 'some other note'},
    ]);
  });

  it('should return regular notes for live session when there are fewer', () => {
    const exercise = {} as unknown as Exercise;
    const slideState = {
      current: {
        hostNotes: [
          {text: 'some note', asyncText: 'some async note'},
          {asyncText: 'some other async note'},
        ],
      },
    } as SessionSlideState;

    const {result} = renderHook(() =>
      useResolveHostNotes(false, exercise, slideState, false),
    );

    expect(result.current).toEqual([{text: 'some note'}]);
  });

  it('should fallback to async notes for live session', () => {
    const exercise = {} as unknown as Exercise;
    const slideState = {
      current: {
        hostNotes: [
          {asyncText: 'some async note'},
          {asyncText: 'some other async note'},
        ],
      },
    } as SessionSlideState;

    const {result} = renderHook(() =>
      useResolveHostNotes(false, exercise, slideState, false),
    );

    expect(result.current).toEqual([
      {text: 'some async note'},
      {text: 'some other async note'},
    ]);
  });

  it('should return async notes for async session', () => {
    const exercise = {} as unknown as Exercise;
    const slideState = {
      current: {
        hostNotes: [
          {text: 'some note', asyncText: 'some async note'},
          {text: 'some other note', asyncText: 'some other async note'},
        ],
      },
    } as SessionSlideState;

    const {result} = renderHook(() =>
      useResolveHostNotes(false, exercise, slideState, true),
    );

    expect(result.current).toEqual([
      {text: 'some async note'},
      {text: 'some other async note'},
    ]);
  });

  it('should return async notes for async session when there are fewer', () => {
    const exercise = {} as unknown as Exercise;
    const slideState = {
      current: {
        hostNotes: [
          {text: 'some note', asyncText: 'some async note'},
          {text: 'some other note'},
        ],
      },
    } as SessionSlideState;

    const {result} = renderHook(() =>
      useResolveHostNotes(false, exercise, slideState, true),
    );

    expect(result.current).toEqual([{text: 'some async note'}]);
  });

  it('should fallback to regular notes for async session', () => {
    const exercise = {} as unknown as Exercise;
    const slideState = {
      current: {
        hostNotes: [{text: 'some note'}, {text: 'some other note'}],
      },
    } as SessionSlideState;

    const {result} = renderHook(() =>
      useResolveHostNotes(false, exercise, slideState, true),
    );

    expect(result.current).toEqual([
      {text: 'some note'},
      {text: 'some other note'},
    ]);
  });
});
