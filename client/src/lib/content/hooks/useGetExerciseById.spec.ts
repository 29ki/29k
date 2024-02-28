import {renderHook} from '@testing-library/react-hooks';
import {act} from 'react-test-renderer';
import useGetExerciseById from './useGetExerciseById';
import useAppState from '../../appState/state/state';

const mockT = jest.fn().mockReturnValue({name: 'some-exercise'});
jest.mock('react-i18next', () => ({
  useTranslation: jest.fn(() => ({
    t: mockT,
  })),
}));

const mockUseUnlockedExerciseIds = jest.fn().mockReturnValue([]);
jest.mock(
  '../../user/hooks/useUnlockedExerciseIds',
  () => () => mockUseUnlockedExerciseIds(),
);

afterEach(() => {
  jest.clearAllMocks();
});

describe('useGetExerciseById', () => {
  it('returns a translated exercise', () => {
    const {result} = renderHook(() => useGetExerciseById());

    act(() => {
      expect(result.current('some-exercise-id')).toEqual({
        name: 'some-exercise',
      });
    });

    expect(mockT).toHaveBeenCalledTimes(1);
    expect(mockT).toHaveBeenCalledWith('some-exercise-id', {
      returnObjects: true,
    });
  });

  it('returns null if exercise is not found', () => {
    mockT.mockReturnValueOnce('some-exercise-id');
    const {result} = renderHook(() => useGetExerciseById());

    act(() => {
      expect(result.current('some-exercise-id')).toBe(null);
    });
  });

  it('returns a translated exercise for a specific language', () => {
    const {result} = renderHook(() => useGetExerciseById());

    act(() => {
      expect(result.current('some-exercise-id', 'sv')).toEqual({
        name: 'some-exercise',
      });
    });

    expect(mockT).toHaveBeenCalledTimes(1);
    expect(mockT).toHaveBeenCalledWith('some-exercise-id', {
      returnObjects: true,
      lng: 'sv',
    });
  });

  it('returns null if exercise is locked', () => {
    mockT.mockReturnValueOnce({name: 'some-exercise-id', locked: true});
    const {result} = renderHook(() => useGetExerciseById());

    act(() => {
      expect(result.current('some-exercise-id')).toBe(null);
    });
  });

  it('returns locked exercise if appState.showLockedContent == true', () => {
    useAppState.setState({
      settings: {
        showLockedContent: true,
        showHiddenContent: false,
        showOnboarding: false,
      },
    });
    mockT.mockReturnValueOnce({name: 'some-exercise', locked: true});
    const {result} = renderHook(() => useGetExerciseById());

    act(() => {
      expect(result.current('some-exercise-id')).toEqual({
        name: 'some-exercise',
        locked: true,
      });
    });
  });

  it('returns locked exercise if id is in useUnlockedExerciseIds', () => {
    mockUseUnlockedExerciseIds.mockReturnValueOnce(['some-exercise-id']);
    mockT.mockReturnValueOnce({
      id: 'some-exercise-id',
      name: 'some-exercise',
      locked: true,
    });
    const {result} = renderHook(() => useGetExerciseById());

    act(() => {
      expect(result.current('some-exercise-id')).toEqual({
        id: 'some-exercise-id',
        name: 'some-exercise',
        locked: true,
      });
    });
  });
});
