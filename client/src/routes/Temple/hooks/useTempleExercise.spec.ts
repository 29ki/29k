import {renderHook} from '@testing-library/react-hooks';
import {RecoilRoot} from 'recoil';
import {TempleData} from '../../../../../shared/src/types/Temple';
import useExerciseById from '../../../lib/content/hooks/useExerciseById';
import {templeAtom} from '../state/state';
import useTempleExercise from './useTempleExercise';

jest.mock('../../../lib/content/hooks/useExerciseById', () => jest.fn());

const mockUseExerciseById = useExerciseById as jest.Mock;

describe('useTempleExercise', () => {
  it('should return null if no exercise exists', () => {
    mockUseExerciseById.mockReturnValue(null);
    const {result} = renderHook(() => useTempleExercise(), {
      wrapper: RecoilRoot,
      initialProps: {
        initializeState: ({set}) => {
          set(templeAtom, {
            id: 'test',
          } as TempleData);
        },
        children: null,
      },
    });

    expect(result.current).toBe(null);
  });

  it('should return null if no temple exists', () => {
    mockUseExerciseById.mockReturnValue({});
    const {result} = renderHook(() => useTempleExercise(), {
      wrapper: RecoilRoot,
      initialProps: {
        initializeState: ({set}) => {
          set(templeAtom, null);
        },
        children: null,
      },
    });

    expect(result.current).toBe(null);
  });

  it('should return exercise and slide', () => {
    mockUseExerciseById.mockReturnValue({
      slides: [{type: 'slide-1'}, {type: 'slide-2'}, {type: 'slide-3'}],
    });
    const {result} = renderHook(() => useTempleExercise(), {
      wrapper: RecoilRoot,
      initialProps: {
        initializeState: ({set}) => {
          set(templeAtom, {exerciseState: {index: 1}} as TempleData);
        },
        children: null,
      },
    });

    expect(result.current).toEqual({
      slide: {
        index: 1,
        current: {type: 'slide-2'},
        next: {type: 'slide-3'},
        previous: {type: 'slide-1'},
      },
      slides: [{type: 'slide-1'}, {type: 'slide-2'}, {type: 'slide-3'}],
    });
  });

  it('should memoize return', () => {
    mockUseExerciseById.mockReturnValue({
      slides: [{type: 'slide-1'}, {type: 'slide-2'}, {type: 'slide-3'}],
    });
    const {result, rerender} = renderHook(() => useTempleExercise(), {
      wrapper: RecoilRoot,
      initialProps: {
        initializeState: ({set}) => {
          set(templeAtom, {exerciseState: {index: 1}} as TempleData);
        },
        children: null,
      },
    });

    rerender();

    expect(result.all.length).toBe(2);
    expect(result.all[0]).toBe(result.all[1]);
  });

  it('should return exercise and only current slide', () => {
    mockUseExerciseById.mockReturnValue({
      slides: [{type: 'slide-1'}],
    });
    const {result} = renderHook(() => useTempleExercise(), {
      wrapper: RecoilRoot,
      initialProps: {
        initializeState: ({set}) => {
          set(templeAtom, {exerciseState: {index: 0}} as TempleData);
        },
        children: null,
      },
    });

    expect(result.current).toEqual({
      slide: {
        index: 0,
        current: {type: 'slide-1'},
        next: undefined,
        previous: undefined,
      },
      slides: [{type: 'slide-1'}],
    });
  });
});
