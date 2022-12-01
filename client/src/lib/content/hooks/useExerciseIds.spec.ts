import {act, renderHook} from '@testing-library/react-hooks';
import useAppState from '../../appState/state/state';
import useExerciseIds from './useExerciseIds';

jest.mock(
  '../../../../../content/content.json',
  () => ({
    exerciseIds: ['test-id-1', 'test-id-2'],
  }),
  {virtual: true},
);

const mockT = jest
  .fn()
  .mockReturnValueOnce({published: false})
  .mockReturnValueOnce({published: true});

jest.mock('react-i18next', () => ({
  useTranslation: jest.fn(() => ({
    t: mockT,
  })),
}));

afterEach(() => {
  jest.clearAllMocks();
});

describe('useExerciseIds', () => {
  const useTestHook = () => {
    const setShowNonPublishedContent = useAppState(
      state => state.setShowNonPublishedContent,
    );
    const exerciseIds = useExerciseIds();

    return {
      exerciseIds,
      setShowNonPublishedContent,
    };
  };

  it('returns only published exercises', () => {
    const {result} = renderHook(useTestHook);

    expect(mockT).toHaveBeenCalledTimes(2);
    expect(mockT).toHaveBeenCalledWith('test-id-1', {
      returnObjects: true,
    });
    expect(mockT).toHaveBeenCalledWith('test-id-2', {
      returnObjects: true,
    });

    expect(result.current.exerciseIds).toEqual(['test-id-2']);
  });

  it('returns all exercises', () => {
    const {result} = renderHook(useTestHook);

    act(() => {
      result.current.setShowNonPublishedContent(true);
    });

    expect(mockT).toHaveBeenCalledTimes(2);
    expect(mockT).toHaveBeenCalledWith('test-id-1', {
      returnObjects: true,
    });
    expect(mockT).toHaveBeenCalledWith('test-id-2', {
      returnObjects: true,
    });

    expect(result.current.exerciseIds).toEqual(['test-id-1', 'test-id-2']);
  });
});
