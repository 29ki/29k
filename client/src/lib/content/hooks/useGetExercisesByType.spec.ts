import {renderHook} from '@testing-library/react-hooks';
import {SessionType} from '../../../../../shared/src/types/Session';
import useGetExercisesByType from './useGetExercisesByType';

const mockT = jest.fn();

const mockGetDataByLanguage = jest.fn().mockReturnValue({
  exercises: {'some-exercise-id': {}, 'some-async-exercise-id': {}},
});

jest.mock('react-i18next', () => ({
  useTranslation: jest.fn(() => ({
    t: mockT,
    i18n: {
      getDataByLanguage: mockGetDataByLanguage,
    },
  })),
}));

afterEach(() => {
  jest.clearAllMocks();
});

describe('useGetExercisesByType', () => {
  it('returns async enabled translated exercises', () => {
    mockT
      .mockReturnValueOnce({id: 'some-exercise-id'})
      .mockReturnValueOnce({id: 'some-async-exercise-id', async: true});

    const {result} = renderHook(() => useGetExercisesByType(SessionType.async));

    expect(mockT).toHaveBeenCalledTimes(2);
    expect(mockT).toHaveBeenCalledWith('some-exercise-id', {
      returnObjects: true,
    });
    expect(mockGetDataByLanguage).toHaveBeenCalledTimes(1);

    expect(result.current).toEqual([
      {id: 'some-async-exercise-id', async: true},
    ]);
  });

  // For some reasong it can't find {t} the second time, skipping for now
  it('returns all translated exercises', () => {
    mockT
      .mockReturnValueOnce({id: 'some-exercise-id'})
      .mockReturnValueOnce({id: 'some-async-exercise-id', async: true});

    const {result} = renderHook(() =>
      useGetExercisesByType(SessionType.private),
    );

    expect(result.current).toEqual([
      {id: 'some-exercise-id'},
      {id: 'some-async-exercise-id', async: true},
    ]);
  });
});
