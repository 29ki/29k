import {renderHook} from '@testing-library/react-hooks';
import {Exercise} from '../../../../../shared/src/types/generated/Exercise';

import useSessionState from '../state/state';
import useExerciseTheme from './useExerciseTheme';

afterEach(() => {
  jest.clearAllMocks();
});

describe('useExerciseTheme', () => {
  it('returns current session exercise theme', async () => {
    useSessionState.setState({
      exercise: {theme: {backgroundColor: 'someBackgroundColor'}} as Exercise,
    });

    const {result} = renderHook(() => useExerciseTheme());

    expect(result.current).toEqual({backgroundColor: 'someBackgroundColor'});
  });

  it('returns undefined', async () => {
    const {result} = renderHook(() => useExerciseTheme());

    expect(result.current).toBe(undefined);
  });
});
