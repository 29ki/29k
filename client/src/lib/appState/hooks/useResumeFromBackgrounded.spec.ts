import {cleanup, renderHook} from '@testing-library/react-hooks';
import {AppState} from 'react-native';
import useResumeFromBackgrounded from './useResumeFromBackgrounded';

const subscriptionMock = {remove: jest.fn()};
(AppState.addEventListener as jest.Mock).mockImplementation((_, callback) => {
  callback('active');

  return subscriptionMock;
});

afterEach(async () => {
  await cleanup();
  jest.clearAllMocks();
});

describe('useResumeFromBackgrounded', () => {
  it('subsribes to RN AppState events', () => {
    renderHook(() => useResumeFromBackgrounded());

    expect(AppState.addEventListener).toHaveBeenCalledTimes(1);
    expect(AppState.addEventListener).toHaveBeenCalledWith(
      'change',
      expect.any(Function),
    );
  });

  it('triggers callback if coming from background', () => {
    AppState.currentState = 'background';

    const callback = jest.fn();
    renderHook(() => useResumeFromBackgrounded(callback));

    expect(callback).toHaveBeenCalledTimes(1);
  });

  it('does not trigger callback if state is already active', () => {
    AppState.currentState = 'active';

    const callback = jest.fn();
    renderHook(() => useResumeFromBackgrounded(callback));

    expect(callback).toHaveBeenCalledTimes(0);
  });

  it('does not trigger callback for other state differences', () => {
    AppState.currentState = 'unknown';

    const callback = jest.fn();
    renderHook(() => useResumeFromBackgrounded(callback));

    expect(callback).toHaveBeenCalledTimes(0);
  });

  it('unsubscribes on unmount', () => {
    const {unmount} = renderHook(useResumeFromBackgrounded);

    expect(subscriptionMock.remove).toHaveBeenCalledTimes(0);

    unmount();

    expect(subscriptionMock.remove).toHaveBeenCalledTimes(1);
  });
});
