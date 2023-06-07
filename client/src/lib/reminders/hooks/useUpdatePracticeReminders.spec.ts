import {renderHook} from '@testing-library/react-hooks';
import useUserState, {PinnedCollection} from '../../user/state/state';
import useUpdatePracticeReminders from './useUpdatePracticeReminders';
import {CompletedCollectionEvent} from '../../../../../shared/src/types/Event';
import {NOTIFICATION_CHANNELS} from '../../notifications/constants';
import dayjs from 'dayjs';
import {REMINDER_INTERVALS} from '../constants';
import {FirebaseAuthTypes} from '@react-native-firebase/auth';

let mockPinnedCollections: Array<PinnedCollection> = [];
jest.mock('../../user/hooks/usePinnedCollections', () => () => ({
  pinnedCollections: mockPinnedCollections,
}));

let mockCompletedCollectionEvents: Array<CompletedCollectionEvent> = [];
jest.mock('../../user/hooks/useUserEvents', () => () => ({
  completedCollectionEvents: mockCompletedCollectionEvents,
}));

const mockGetCollectionById = jest.fn();
jest.mock(
  '../../content/hooks/useGetCollectionById',
  () => () => mockGetCollectionById,
);

const mockedSetTriggerNotification = jest.fn();
const mockedRemoveTriggerNotifications = jest.fn();
jest.mock('../../notifications/hooks/useTriggerNotifications', () => () => ({
  setTriggerNotification: mockedSetTriggerNotification,
  removeTriggerNotifications: mockedRemoveTriggerNotifications,
}));

afterEach(() => {
  mockPinnedCollections.length = 0;
  mockCompletedCollectionEvents.length = 0;
  jest.useRealTimers();
  jest.clearAllMocks();
});

describe('useUpdatePracticeReminders', () => {
  it('should create 4 notifications weekly with to first ongoing collection', async () => {
    jest
      .useFakeTimers({doNotFake: ['nextTick', 'setImmediate']})
      .setSystemTime(new Date('2023-05-31T10:00:00Z'));
    useUserState.setState({
      user: {uid: 'some-user-id', isAnonymous: false} as FirebaseAuthTypes.User,
    });
    mockPinnedCollections.push(
      {
        id: 'some-collection-id',
        startedAt: '2023-05-31T10:00:00Z',
      },
      {
        id: 'some-other-collection-id',
        startedAt: '2023-06-01T10:00:00Z',
      },
    );
    mockGetCollectionById.mockReturnValueOnce({
      link: 'some-link',
      name: 'some name',
    });
    const {result} = renderHook(() => useUpdatePracticeReminders());

    await result.current.updatePracticeNotifications({
      interval: REMINDER_INTERVALS.THURSDAY,
      hour: 10,
      minute: 0,
    });

    expect(mockGetCollectionById).toHaveBeenCalledWith('some-collection-id');
    expect(mockedRemoveTriggerNotifications).toHaveBeenCalledTimes(1);
    expect(mockedSetTriggerNotification).toHaveBeenCalledTimes(4);
    expect(mockedSetTriggerNotification).toHaveBeenCalledWith(
      'practice-0',
      NOTIFICATION_CHANNELS.PRACTICE_REMINDERS,
      'reminders.collection.0.title',
      'reminders.collection.0.body',
      'some-link',
      undefined,
      dayjs('2023-06-01T10:00:00Z').valueOf(),
    );
    expect(mockedSetTriggerNotification).toHaveBeenCalledWith(
      'practice-1',
      NOTIFICATION_CHANNELS.PRACTICE_REMINDERS,
      'reminders.collection.1.title',
      'reminders.collection.1.body',
      'some-link',
      undefined,
      dayjs('2023-06-08T10:00:00Z').valueOf(),
    );
    expect(mockedSetTriggerNotification).toHaveBeenCalledWith(
      'practice-2',
      NOTIFICATION_CHANNELS.PRACTICE_REMINDERS,
      'reminders.collection.2.title',
      'reminders.collection.2.body',
      'some-link',
      undefined,
      dayjs('2023-06-15T10:00:00Z').valueOf(),
    );
    expect(mockedSetTriggerNotification).toHaveBeenCalledWith(
      'practice-3',
      NOTIFICATION_CHANNELS.PRACTICE_REMINDERS,
      'reminders.collection.3.title',
      'reminders.collection.3.body',
      'some-link',
      undefined,
      dayjs('2023-06-22T10:00:00Z').valueOf(),
    );
  });

  it('should create 4 notifications daily with first ongoing collection', async () => {
    jest
      .useFakeTimers({doNotFake: ['nextTick', 'setImmediate']})
      .setSystemTime(new Date('2023-05-31T10:00:00Z'));
    useUserState.setState({
      user: {uid: 'some-user-id', isAnonymous: false} as FirebaseAuthTypes.User,
    });
    mockPinnedCollections.push(
      {
        id: 'some-collection-id',
        startedAt: '2023-05-31T10:00:00Z',
      },
      {
        id: 'some-other-collection-id',
        startedAt: '2023-06-01T10:00:00Z',
      },
    );
    mockGetCollectionById.mockReturnValueOnce({
      link: 'some-link',
      name: 'some name',
    });
    const {result} = renderHook(() => useUpdatePracticeReminders());

    await result.current.updatePracticeNotifications({
      interval: REMINDER_INTERVALS.DAILY,
      hour: 10,
      minute: 0,
    });

    expect(mockGetCollectionById).toHaveBeenCalledWith('some-collection-id');
    expect(mockedRemoveTriggerNotifications).toHaveBeenCalledTimes(1);
    expect(mockedSetTriggerNotification).toHaveBeenCalledTimes(4);
    expect(mockedSetTriggerNotification).toHaveBeenCalledWith(
      'practice-0',
      NOTIFICATION_CHANNELS.PRACTICE_REMINDERS,
      'reminders.collection.0.title',
      'reminders.collection.0.body',
      'some-link',
      undefined,
      dayjs('2023-06-01T10:00:00Z').valueOf(),
    );
    expect(mockedSetTriggerNotification).toHaveBeenCalledWith(
      'practice-1',
      NOTIFICATION_CHANNELS.PRACTICE_REMINDERS,
      'reminders.collection.1.title',
      'reminders.collection.1.body',
      'some-link',
      undefined,
      dayjs('2023-06-02T10:00:00Z').valueOf(),
    );
    expect(mockedSetTriggerNotification).toHaveBeenCalledWith(
      'practice-2',
      NOTIFICATION_CHANNELS.PRACTICE_REMINDERS,
      'reminders.collection.2.title',
      'reminders.collection.2.body',
      'some-link',
      undefined,
      dayjs('2023-06-03T10:00:00Z').valueOf(),
    );
    expect(mockedSetTriggerNotification).toHaveBeenCalledWith(
      'practice-3',
      NOTIFICATION_CHANNELS.PRACTICE_REMINDERS,
      'reminders.collection.3.title',
      'reminders.collection.3.body',
      'some-link',
      undefined,
      dayjs('2023-06-04T10:00:00Z').valueOf(),
    );
  });

  it('should create 4 notifications daily with first ongoing collection for anonymous user', async () => {
    jest
      .useFakeTimers({doNotFake: ['nextTick', 'setImmediate']})
      .setSystemTime(new Date('2023-05-31T10:00:00Z'));
    useUserState.setState({
      user: {uid: 'some-user-id', isAnonymous: true} as FirebaseAuthTypes.User,
    });
    mockPinnedCollections.push(
      {
        id: 'some-collection-id',
        startedAt: '2023-05-31T10:00:00Z',
      },
      {
        id: 'some-other-collection-id',
        startedAt: '2023-06-01T10:00:00Z',
      },
    );
    mockGetCollectionById.mockReturnValueOnce({
      link: 'some-link',
      name: 'some name',
    });
    const {result} = renderHook(() => useUpdatePracticeReminders());

    await result.current.updatePracticeNotifications({
      interval: REMINDER_INTERVALS.DAILY,
      hour: 10,
      minute: 0,
    });

    expect(mockGetCollectionById).toHaveBeenCalledWith('some-collection-id');
    expect(mockedRemoveTriggerNotifications).toHaveBeenCalledTimes(1);
    expect(mockedSetTriggerNotification).toHaveBeenCalledTimes(4);
    expect(mockedSetTriggerNotification).toHaveBeenCalledWith(
      'practice-0',
      NOTIFICATION_CHANNELS.PRACTICE_REMINDERS,
      'reminders.collection.0.title',
      'reminders.collection.0.bodyAnonymous',
      'some-link',
      undefined,
      dayjs('2023-06-01T10:00:00Z').valueOf(),
    );
    expect(mockedSetTriggerNotification).toHaveBeenCalledWith(
      'practice-1',
      NOTIFICATION_CHANNELS.PRACTICE_REMINDERS,
      'reminders.collection.1.title',
      'reminders.collection.1.bodyAnonymous',
      'some-link',
      undefined,
      dayjs('2023-06-02T10:00:00Z').valueOf(),
    );
    expect(mockedSetTriggerNotification).toHaveBeenCalledWith(
      'practice-2',
      NOTIFICATION_CHANNELS.PRACTICE_REMINDERS,
      'reminders.collection.2.title',
      'reminders.collection.2.bodyAnonymous',
      'some-link',
      undefined,
      dayjs('2023-06-03T10:00:00Z').valueOf(),
    );
    expect(mockedSetTriggerNotification).toHaveBeenCalledWith(
      'practice-3',
      NOTIFICATION_CHANNELS.PRACTICE_REMINDERS,
      'reminders.collection.3.title',
      'reminders.collection.3.bodyAnonymous',
      'some-link',
      undefined,
      dayjs('2023-06-04T10:00:00Z').valueOf(),
    );
  });

  it('should create 4 notifications daily without collection', async () => {
    jest
      .useFakeTimers({doNotFake: ['nextTick', 'setImmediate']})
      .setSystemTime(new Date('2023-05-31T10:00:00Z'));
    useUserState.setState({
      user: {uid: 'some-user-id', isAnonymous: false} as FirebaseAuthTypes.User,
    });
    mockPinnedCollections.push({
      id: 'some-collection-id',
      startedAt: '2023-05-30T10:00:00Z',
    });
    mockCompletedCollectionEvents.push({
      type: 'completedCollection',
      timestamp: '2023-05-31T09:00:00Z',
      payload: {
        id: 'some-collection-id',
      },
    });
    mockGetCollectionById.mockReturnValueOnce({
      link: 'some-link',
      name: 'some name',
    });
    const {result} = renderHook(() => useUpdatePracticeReminders());

    await result.current.updatePracticeNotifications({
      interval: REMINDER_INTERVALS.DAILY,
      hour: 10,
      minute: 0,
    });

    expect(mockGetCollectionById).toHaveBeenCalledTimes(0);
    expect(mockedRemoveTriggerNotifications).toHaveBeenCalledTimes(1);
    expect(mockedSetTriggerNotification).toHaveBeenCalledTimes(4);
    expect(mockedSetTriggerNotification).toHaveBeenCalledWith(
      'practice-0',
      NOTIFICATION_CHANNELS.PRACTICE_REMINDERS,
      'reminders.general.0.title',
      'reminders.general.0.body',
      undefined,
      undefined,
      dayjs('2023-06-01T10:00:00Z').valueOf(),
    );
    expect(mockedSetTriggerNotification).toHaveBeenCalledWith(
      'practice-1',
      NOTIFICATION_CHANNELS.PRACTICE_REMINDERS,
      'reminders.general.1.title',
      'reminders.general.1.body',
      undefined,
      undefined,
      dayjs('2023-06-02T10:00:00Z').valueOf(),
    );
    expect(mockedSetTriggerNotification).toHaveBeenCalledWith(
      'practice-2',
      NOTIFICATION_CHANNELS.PRACTICE_REMINDERS,
      'reminders.general.2.title',
      'reminders.general.2.body',
      undefined,
      undefined,
      dayjs('2023-06-03T10:00:00Z').valueOf(),
    );
    expect(mockedSetTriggerNotification).toHaveBeenCalledWith(
      'practice-3',
      NOTIFICATION_CHANNELS.PRACTICE_REMINDERS,
      'reminders.general.3.title',
      'reminders.general.3.body',
      undefined,
      undefined,
      dayjs('2023-06-04T10:00:00Z').valueOf(),
    );
  });

  it('should create 4 notifications daily with config from state for anonymous user', async () => {
    jest
      .useFakeTimers({doNotFake: ['nextTick', 'setImmediate']})
      .setSystemTime(new Date('2023-05-31T10:00:00Z'));
    useUserState.setState({
      user: {uid: 'some-user-id', isAnonymous: true} as FirebaseAuthTypes.User,
      userState: {
        'some-user-id': {
          practiceReminderConfig: {
            interval: REMINDER_INTERVALS.DAILY,
            hour: 10,
            minute: 0,
          },
        },
      },
    });
    mockPinnedCollections.push({
      id: 'some-collection-id',
      startedAt: '2023-05-30T10:00:00Z',
    });
    mockCompletedCollectionEvents.push({
      type: 'completedCollection',
      timestamp: '2023-05-31T09:00:00Z',
      payload: {
        id: 'some-collection-id',
      },
    });
    mockGetCollectionById.mockReturnValueOnce({
      link: 'some-link',
      name: 'some name',
    });
    const {result} = renderHook(() => useUpdatePracticeReminders());

    await result.current.updatePracticeNotifications();

    expect(mockGetCollectionById).toHaveBeenCalledTimes(0);
    expect(mockedRemoveTriggerNotifications).toHaveBeenCalledTimes(1);
    expect(mockedSetTriggerNotification).toHaveBeenCalledTimes(4);
    expect(mockedSetTriggerNotification).toHaveBeenCalledWith(
      'practice-0',
      NOTIFICATION_CHANNELS.PRACTICE_REMINDERS,
      'reminders.general.0.title',
      'reminders.general.0.bodyAnonymous',
      undefined,
      undefined,
      dayjs('2023-06-01T10:00:00Z').valueOf(),
    );
    expect(mockedSetTriggerNotification).toHaveBeenCalledWith(
      'practice-1',
      NOTIFICATION_CHANNELS.PRACTICE_REMINDERS,
      'reminders.general.1.title',
      'reminders.general.1.bodyAnonymous',
      undefined,
      undefined,
      dayjs('2023-06-02T10:00:00Z').valueOf(),
    );
    expect(mockedSetTriggerNotification).toHaveBeenCalledWith(
      'practice-2',
      NOTIFICATION_CHANNELS.PRACTICE_REMINDERS,
      'reminders.general.2.title',
      'reminders.general.2.bodyAnonymous',
      undefined,
      undefined,
      dayjs('2023-06-03T10:00:00Z').valueOf(),
    );
    expect(mockedSetTriggerNotification).toHaveBeenCalledWith(
      'practice-3',
      NOTIFICATION_CHANNELS.PRACTICE_REMINDERS,
      'reminders.general.3.title',
      'reminders.general.3.bodyAnonymous',
      undefined,
      undefined,
      dayjs('2023-06-04T10:00:00Z').valueOf(),
    );
  });

  it('should create 4 notifications daily with config from state', async () => {
    jest
      .useFakeTimers({doNotFake: ['nextTick', 'setImmediate']})
      .setSystemTime(new Date('2023-05-31T10:00:00Z'));
    useUserState.setState({
      user: {uid: 'some-user-id', isAnonymous: false} as FirebaseAuthTypes.User,
      userState: {
        'some-user-id': {
          practiceReminderConfig: {
            interval: REMINDER_INTERVALS.DAILY,
            hour: 10,
            minute: 0,
          },
        },
      },
    });
    mockPinnedCollections.push({
      id: 'some-collection-id',
      startedAt: '2023-05-30T10:00:00Z',
    });
    mockCompletedCollectionEvents.push({
      type: 'completedCollection',
      timestamp: '2023-05-31T09:00:00Z',
      payload: {
        id: 'some-collection-id',
      },
    });
    mockGetCollectionById.mockReturnValueOnce({
      link: 'some-link',
      name: 'some name',
    });
    const {result} = renderHook(() => useUpdatePracticeReminders());

    await result.current.updatePracticeNotifications();

    expect(mockGetCollectionById).toHaveBeenCalledTimes(0);
    expect(mockedRemoveTriggerNotifications).toHaveBeenCalledTimes(1);
    expect(mockedSetTriggerNotification).toHaveBeenCalledTimes(4);
    expect(mockedSetTriggerNotification).toHaveBeenCalledWith(
      'practice-0',
      NOTIFICATION_CHANNELS.PRACTICE_REMINDERS,
      'reminders.general.0.title',
      'reminders.general.0.body',
      undefined,
      undefined,
      dayjs('2023-06-01T10:00:00Z').valueOf(),
    );
    expect(mockedSetTriggerNotification).toHaveBeenCalledWith(
      'practice-1',
      NOTIFICATION_CHANNELS.PRACTICE_REMINDERS,
      'reminders.general.1.title',
      'reminders.general.1.body',
      undefined,
      undefined,
      dayjs('2023-06-02T10:00:00Z').valueOf(),
    );
    expect(mockedSetTriggerNotification).toHaveBeenCalledWith(
      'practice-2',
      NOTIFICATION_CHANNELS.PRACTICE_REMINDERS,
      'reminders.general.2.title',
      'reminders.general.2.body',
      undefined,
      undefined,
      dayjs('2023-06-03T10:00:00Z').valueOf(),
    );
    expect(mockedSetTriggerNotification).toHaveBeenCalledWith(
      'practice-3',
      NOTIFICATION_CHANNELS.PRACTICE_REMINDERS,
      'reminders.general.3.title',
      'reminders.general.3.body',
      undefined,
      undefined,
      dayjs('2023-06-04T10:00:00Z').valueOf(),
    );
  });
});
