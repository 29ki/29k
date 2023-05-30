import {renderHook} from '@testing-library/react-hooks';
import {LiveSessionType} from '../../../../../shared/src/schemas/Session';

import useSessionReminderNotification from './useSessionReminderNotification';

const mockGetTriggerNotification = jest.fn();
const mockSetTriggerNotification = jest.fn();
const mockRemoveTriggerNotification = jest.fn();
jest.mock('../../../lib/notifications/hooks/useTriggerNotifications', () =>
  jest.fn(() => ({
    getTriggerNotification: mockGetTriggerNotification,
    setTriggerNotification: mockSetTriggerNotification,
    removeTriggerNotification: mockRemoveTriggerNotification,
  })),
);

jest.mock('../../../lib/content/hooks/useExerciseById', () => jest.fn());

afterEach(() => {
  jest.clearAllMocks();
});

describe('useSessionReminderNotification', () => {
  it('returns the notification for a specific id', () => {
    mockGetTriggerNotification.mockReturnValueOnce({id: 'some-session-id'});

    const {result} = renderHook(() =>
      useSessionReminderNotification({
        id: 'some-session-id',
        exerciseId: 'some-content-id',
      } as LiveSessionType),
    );

    expect(result.current.reminderEnabled).toEqual(true);

    expect(mockGetTriggerNotification).toHaveBeenCalledTimes(1);
    expect(mockGetTriggerNotification).toHaveBeenCalledWith('some-session-id');
  });

  it('can enable a reminder', () => {
    const {result} = renderHook(() =>
      useSessionReminderNotification({
        id: 'some-session-id',
        exerciseId: 'some-content-id',
        link: 'http://some.deep/link',
      } as LiveSessionType),
    );

    result.current.toggleReminder(true);

    expect(mockSetTriggerNotification).toHaveBeenCalledTimes(1);
    expect(mockSetTriggerNotification).toHaveBeenCalledWith(
      'some-session-id',
      'session-reminder',
      'title',
      'body',
      'http://some.deep/link',
      expect.any(Number),
    );
  });

  it('can remove a reminder', () => {
    const {result} = renderHook(() =>
      useSessionReminderNotification({
        id: 'some-session-id',
        exerciseId: 'some-content-id',
      } as LiveSessionType),
    );

    result.current.toggleReminder(false);

    expect(mockRemoveTriggerNotification).toHaveBeenCalledTimes(1);
    expect(mockRemoveTriggerNotification).toHaveBeenCalledWith(
      'some-session-id',
    );
  });
});
