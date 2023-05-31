import {renderHook} from '@testing-library/react-hooks';
import {LiveSessionType} from '../../../../../shared/src/schemas/Session';

import useSessionReminderNotification from './useSessionReminderNotification';
import useNotificationsState from '../../notifications/state/state';

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
    useNotificationsState.setState({
      notifications: {
        'some-session-id': {},
      },
    });

    const {result} = renderHook(() =>
      useSessionReminderNotification({
        id: 'some-session-id',
        exerciseId: 'some-content-id',
      } as LiveSessionType),
    );

    expect(result.current.reminderEnabled).toEqual(true);
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
      undefined,
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
