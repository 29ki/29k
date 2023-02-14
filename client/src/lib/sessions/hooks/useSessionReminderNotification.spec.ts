import {renderHook} from '@testing-library/react-hooks';
import {LiveSession} from '../../../../../shared/src/types/Session';
import useTriggerNotification from '../../notifications/hooks/useTriggerNotification';

import useSessionReminderNotification from './useSessionReminderNotification';

jest.mock('../../../lib/notifications/hooks/useTriggerNotification', () =>
  jest.fn(),
);

jest.mock('../../../lib/content/hooks/useExerciseById', () => jest.fn());

const mockUseTriggerNotification = useTriggerNotification as jest.Mock;

afterEach(() => {
  jest.clearAllMocks();
});

describe('useSessionReminderNotification', () => {
  it('returns the notification for a specific id', () => {
    mockUseTriggerNotification.mockReturnValueOnce({
      triggerNotification: {id: 'some-session-id'},
    });

    const {result} = renderHook(() =>
      useSessionReminderNotification({
        id: 'some-session-id',
        exerciseId: 'some-content-id',
      } as LiveSession),
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
      useSessionReminderNotification({
        id: 'some-session-id',
        exerciseId: 'some-content-id',
        link: 'http://some.deep/link',
      } as LiveSession),
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
      useSessionReminderNotification({
        id: 'some-session-id',
        exerciseId: 'some-content-id',
      } as LiveSession),
    );

    result.current.toggleReminder(false);

    expect(mockRemoveNotification).toHaveBeenCalledTimes(1);
    expect(mockRemoveNotification).toHaveBeenCalledWith();
  });
});
