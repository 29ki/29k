import {renderHook, act} from '@testing-library/react-hooks';
import useAppState from '../../appState/state/state';
import useToggleHiddenContent from './useToggleHiddenContent';

const mockReloadResourceBundles = jest.fn();
jest.mock('./useReloadResourceBundles', () => () => mockReloadResourceBundles);

beforeEach(() => {
  jest.clearAllMocks();
});

describe('useToggleHiddenContent', () => {
  it('should reload resources on toggle on', async () => {
    const {result} = renderHook(() => useToggleHiddenContent());

    await act(async () => {
      await result.current(true);
    });

    expect(useAppState.getState().settings.showHiddenContent).toBe(true);
    expect(mockReloadResourceBundles).toHaveBeenCalledTimes(1);
  });

  it('should reload resources on toggle off', async () => {
    const {result} = renderHook(() => useToggleHiddenContent());

    await act(async () => {
      await result.current(false);
    });

    expect(useAppState.getState().settings.showHiddenContent).toBe(false);
    expect(mockReloadResourceBundles).toHaveBeenCalledTimes(1);
  });
});
