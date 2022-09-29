import {renderHook} from '@testing-library/react-hooks';
import {Temple} from '../../../../../shared/src/types/Temple';
import useTriggerNotification from '../../../lib/notifications/hooks/useTriggerNotification';

import useTempleNotificationReminder from './useTempleNotificationReminder';

jest.mock('../../../lib/notifications/hooks/useTriggerNotification', () =>
  jest.fn(),
);

jest.mock('../../../lib/content/hooks/useExerciseById', () => jest.fn());

const mockUseTriggerNotification = useTriggerNotification as jest.Mock;

afterEach(() => {
  jest.clearAllMocks();
});

describe('useTempleNotificationReminder', () => {
  it('returns the notification for a specific id', () => {
    mockUseTriggerNotification.mockReturnValueOnce({
      triggerNotification: {id: 'some-temple-id'},
    });

    const {result} = renderHook(() =>
      useTempleNotificationReminder({
        id: 'some-temple-id',
        name: 'Some name',
        contentId: 'some-content-id',
      } as Temple),
    );

    expect(result.current.reminderEnabled).toEqual(true);

    expect(mockUseTriggerNotification).toHaveBeenCalledTimes(1);
    expect(mockUseTriggerNotification).toHaveBeenCalledWith('some-temple-id');
  });

  it('can enable a reminder', () => {
    const mockSetNotification = jest.fn();
    mockUseTriggerNotification.mockReturnValueOnce({
      setTriggerNotification: mockSetNotification,
    });

    const {result} = renderHook(() =>
      useTempleNotificationReminder({
        id: 'some-temple-id',
        name: 'Some name',
        contentId: 'some-content-id',
      } as Temple),
    );

    result.current.toggleReminder(true);

    expect(mockSetNotification).toHaveBeenCalledTimes(1);
    expect(mockSetNotification).toHaveBeenCalledWith(
      'title',
      'body',
      expect.any(Number),
    );
  });

  it('can remove a reminder', () => {
    const mockRemoveNotification = jest.fn();
    mockUseTriggerNotification.mockReturnValueOnce({
      removeTriggerNotification: mockRemoveNotification,
    });

    const {result} = renderHook(() =>
      useTempleNotificationReminder({
        id: 'some-temple-id',
        name: 'Some name',
        contentId: 'some-content-id',
      } as Temple),
    );

    result.current.toggleReminder(false);

    expect(mockRemoveNotification).toHaveBeenCalledTimes(1);
    expect(mockRemoveNotification).toHaveBeenCalledWith();
  });
});
