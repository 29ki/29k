import {renderHook, act} from '@testing-library/react-hooks';
import useAppState from '../../appState/state/state';
import useToggleLockedContent from './useToggleLockedContent';

beforeEach(() => {
  jest.clearAllMocks();
});

describe('useToggleLockedContent', () => {
  it('should reload resources on toggle on', async () => {
    const {result} = renderHook(() => useToggleLockedContent());

    await act(async () => {
      await result.current(true);
    });

    expect(useAppState.getState().settings.showLockedContent).toBe(true);
  });

  it('should reload resources on toggle off', async () => {
    const {result} = renderHook(() => useToggleLockedContent());

    await act(async () => {
      await result.current(false);
    });

    expect(useAppState.getState().settings.showLockedContent).toBe(false);
  });
});
