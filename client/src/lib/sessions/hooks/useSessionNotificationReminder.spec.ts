import {renderHook} from '@testing-library/react-hooks';
import {Session} from '../../../../../shared/src/types/Session';
import useTriggerNotification from '../../notifications/hooks/useTriggerNotification';

import useSessionNotificationReminder from './useSessionNotificationReminder';

jest.mock('../../../lib/notifications/hooks/useTriggerNotification', () =>
  jest.fn(),
);

jest.mock('../../../lib/content/hooks/useExerciseById', () => jest.fn());

const mockUseTriggerNotification = useTriggerNotification as jest.Mock;

afterEach(() => {
  jest.clearAllMocks();
});

describe('useSessionNotificationReminder', () => {
  it('returns the notification for a specific id', () => {
    mockUseTriggerNotification.mockReturnValueOnce({
      triggerNotification: {id: 'some-session-id'},
    });

    const {result} = renderHook(() =>
      useSessionNotificationReminder({
        id: 'some-session-id',
        exerciseId: 'some-content-id',
      } as Session),
    );

    expect(result.current.reminderEnabled).toEqual(true);

    expect(mockUseTriggerNotification).toHaveBeenCalledTimes(1);
    expect(mockUseTriggerNotification).toHaveBeenCalledWith('some-session-id');
  });

  it('can enable a reminder', () => {
    const mockSetNotification = jest.fn();
    mockUseTriggerNotification.mockReturnValueOnce({
      setTriggerNotification: mockSetNotification,
    });

    const {result} = renderHook(() =>
      useSessionNotificationReminder({
        id: 'some-session-id',
        exerciseId: 'some-content-id',
        link: 'http://some.deep/link',
      } as Session),
    );

    result.current.toggleReminder(true);

    expect(mockSetNotification).toHaveBeenCalledTimes(1);
    expect(mockSetNotification).toHaveBeenCalledWith(
      'title',
      'body',
      'http://some.deep/link',
      expect.any(Number),
    );
  });

  it('can remove a reminder', () => {
    const mockRemoveNotification = jest.fn();
    mockUseTriggerNotification.mockReturnValueOnce({
      removeTriggerNotification: mockRemoveNotification,
    });

    const {result} = renderHook(() =>
      useSessionNotificationReminder({
        id: 'some-session-id',
        exerciseId: 'some-content-id',
      } as Session),
    );

    result.current.toggleReminder(false);

    expect(mockRemoveNotification).toHaveBeenCalledTimes(1);
    expect(mockRemoveNotification).toHaveBeenCalledWith();
  });
});
