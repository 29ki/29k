import {renderHook} from '@testing-library/react-hooks';
import {useNavigation} from '@react-navigation/native';
import useHandleClose from './useHandleClose';
import {SessionMode} from '../../../../../../shared/src/schemas/Session';
import {CompletedSessionEvent} from '../../../../../../shared/src/types/Event';

const mockConfirmPracticeReminders = jest.fn();
jest.mock(
  '../../../../lib/reminders/hooks/useConfirmPracticeReminders',
  () => () => mockConfirmPracticeReminders,
);

const mockAskForRating = jest.fn();
jest.mock(
  '../../../../lib/rating/hooks/useRating',
  () => () => mockAskForRating,
);

jest.mock('../../../../lib/user/hooks/usePinnedCollections', () => () => ({
  pinnedCollections: [{id: 'some-collection-id'}],
}));

const mockGetCollectionsByExerciseId = jest.fn();
jest.mock(
  '../../../../lib/content/hooks/useGetCollectionsByExerciseId',
  () => () => mockGetCollectionsByExerciseId,
);

afterEach(() => {
  jest.clearAllMocks();
});

describe('useHandleClose', () => {
  const navigation = useNavigation();
  const mockNavigate = jest.mocked(navigation.navigate);

  it('should ask for reminders when async session is part of pinned collection', () => {
    mockGetCollectionsByExerciseId.mockReturnValueOnce([
      {id: 'some-collection-id', exercises: ['some-exercise-id']},
    ]);
    const {result} = renderHook(() => useHandleClose());

    result.current(
      {
        payload: {
          exerciseId: 'some-exercise-id',
          mode: SessionMode.async,
        },
      } as CompletedSessionEvent,
      true,
    );

    expect(mockNavigate).toHaveBeenCalledTimes(1);
    expect(mockNavigate).toHaveBeenCalledWith('CompletedSessionModal', {
      completedSessionEvent: {
        payload: {
          exerciseId: 'some-exercise-id',
          mode: SessionMode.async,
        },
      },
    });
    expect(mockConfirmPracticeReminders).toHaveBeenCalledTimes(1);
    expect(mockConfirmPracticeReminders).toHaveBeenCalledWith(true);
    expect(mockAskForRating).toHaveBeenCalledTimes(1);
  });

  it('should only ask for review when async session is not part of pinned collection', () => {
    mockGetCollectionsByExerciseId.mockReturnValueOnce([]);
    const {result} = renderHook(() => useHandleClose());

    result.current(
      {
        payload: {
          exerciseId: 'some-exercise-id',
          mode: SessionMode.async,
        },
      } as CompletedSessionEvent,
      true,
    );

    expect(mockNavigate).toHaveBeenCalledTimes(1);
    expect(mockNavigate).toHaveBeenCalledWith('CompletedSessionModal', {
      completedSessionEvent: {
        payload: {
          exerciseId: 'some-exercise-id',
          mode: SessionMode.async,
        },
      },
    });
    expect(mockConfirmPracticeReminders).toHaveBeenCalledTimes(0);
    expect(mockAskForRating).toHaveBeenCalledTimes(1);
  });

  it('should only ask for review when session is not async is not part of pinned collection', () => {
    mockGetCollectionsByExerciseId.mockReturnValueOnce([
      {id: 'some-collection-id', exercises: ['some-exercise-id']},
    ]);
    const {result} = renderHook(() => useHandleClose());

    result.current(
      {
        payload: {
          exerciseId: 'some-exercise-id',
          mode: SessionMode.live,
        },
      } as CompletedSessionEvent,
      true,
    );

    expect(mockNavigate).toHaveBeenCalledTimes(1);
    expect(mockNavigate).toHaveBeenCalledWith('CompletedSessionModal', {
      completedSessionEvent: {
        payload: {
          exerciseId: 'some-exercise-id',
          mode: SessionMode.live,
        },
      },
    });
    expect(mockConfirmPracticeReminders).toHaveBeenCalledTimes(0);
    expect(mockAskForRating).toHaveBeenCalledTimes(1);
  });

  it('should not ask for review when answer is false', () => {
    mockGetCollectionsByExerciseId.mockReturnValueOnce([
      {id: 'some-collection-id', exercises: ['some-exercise-id']},
    ]);
    const {result} = renderHook(() => useHandleClose());

    result.current(
      {
        payload: {
          exerciseId: 'some-exercise-id',
          mode: SessionMode.live,
        },
      } as CompletedSessionEvent,
      false,
    );

    expect(mockNavigate).toHaveBeenCalledTimes(1);
    expect(mockNavigate).toHaveBeenCalledWith('CompletedSessionModal', {
      completedSessionEvent: {
        payload: {
          exerciseId: 'some-exercise-id',
          mode: SessionMode.live,
        },
      },
    });
    expect(mockConfirmPracticeReminders).toHaveBeenCalledTimes(0);
    expect(mockAskForRating).toHaveBeenCalledTimes(0);
  });
});
