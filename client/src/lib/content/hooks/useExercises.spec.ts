import {renderHook} from '@testing-library/react-hooks';
import useAppState from '../../appState/state/state';
import useExercises from './useExercises';

jest.mock('./useExerciseIds', () => () => [
  'some-exercise-id',
  'some-other-exercise-id',
]);

const mockGetExerciseById = jest.fn();

jest.mock('./useGetExerciseById', () => () => mockGetExerciseById);

afterEach(() => {
  jest.clearAllMocks();
});

describe('useExercises', () => {
  it('should return exercises sorted by name', () => {
    mockGetExerciseById
      .mockReturnValueOnce({name: 'bbb'})
      .mockReturnValueOnce({name: 'aaa'});

    const {result} = renderHook(() => useExercises());

    expect(mockGetExerciseById).toHaveBeenCalledTimes(2);
    expect(mockGetExerciseById).toHaveBeenCalledWith('some-exercise-id', 'en');
    expect(mockGetExerciseById).toHaveBeenCalledWith(
      'some-other-exercise-id',
      'en',
    );
    expect(result.current).toEqual([{name: 'aaa'}, {name: 'bbb'}]);
  });

  it('should return exercises sorted by name with user preferred language', () => {
    mockGetExerciseById
      .mockReturnValueOnce({name: 'bbb'})
      .mockReturnValueOnce({name: 'aaa'});
    useAppState.setState({
      settings: {
        preferredLanguage: 'sv',
        showWelcome: false,
        showHiddenContent: false,
      },
    });

    const {result} = renderHook(() => useExercises());

    expect(mockGetExerciseById).toHaveBeenCalledTimes(2);
    expect(mockGetExerciseById).toHaveBeenCalledWith('some-exercise-id', 'sv');
    expect(mockGetExerciseById).toHaveBeenCalledWith(
      'some-other-exercise-id',
      'sv',
    );
    expect(result.current).toEqual([{name: 'aaa'}, {name: 'bbb'}]);
  });
});
