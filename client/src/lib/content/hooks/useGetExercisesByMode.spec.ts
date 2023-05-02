import {renderHook} from '@testing-library/react-hooks';
import {SessionMode} from '../../../../../shared/src/schemas/Session';
import useGetExercisesByMode from './useGetExercisesByMode';

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

describe('useGetExercisesByMode', () => {
  it('returns async enabled translated exercises', () => {
    mockT
      .mockReturnValueOnce({id: 'some-exercise-id', live: true})
      .mockReturnValueOnce({
        id: 'some-async-exercise-id',
        live: true,
        async: true,
      });

    const {result} = renderHook(() => useGetExercisesByMode(SessionMode.async));

    expect(mockT).toHaveBeenCalledTimes(2);
    expect(mockT).toHaveBeenCalledWith('some-exercise-id', {
      lng: 'en',
      returnObjects: true,
    });
    expect(mockGetDataByLanguage).toHaveBeenCalledTimes(1);

    expect(result.current).toEqual([
      {id: 'some-async-exercise-id', live: true, async: true},
    ]);
  });

  // For some reasong it can't find {t} the second time, skipping for now
  it('returns only live enabled translated exercises', () => {
    mockT
      .mockReturnValueOnce({id: 'some-exercise-id', live: true})
      .mockReturnValueOnce({
        id: 'some-async-exercise-id',
        live: false,
        async: true,
      });

    const {result} = renderHook(() => useGetExercisesByMode(SessionMode.live));

    expect(result.current).toEqual([{id: 'some-exercise-id', live: true}]);
  });
});
