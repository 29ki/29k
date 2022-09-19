import {DailyParticipant} from '@daily-co/react-native-daily-js';
import {act, renderHook} from '@testing-library/react-hooks';
import {RecoilRoot, useRecoilValue, useSetRecoilState} from 'recoil';
import {participantsAtom, participantsSortOrderAtom} from '../state/state';
import useSetParticipantsSortOrder from './useSetParticipantsSortOrder';

const createParticipant = (id: string, local = false) => ({
  [id]: {user_id: id, local} as DailyParticipant,
});

describe('setActiveParticipants', () => {
  const useTestHook = () => {
    // Actual function to test
    const setParticipantsSortOrder = useSetParticipantsSortOrder();
    // State to expect on
    const activeParticipants = useRecoilValue(participantsSortOrderAtom);
    // Default state depends on participants atom
    const setParticipants = useSetRecoilState(participantsAtom);

    return {
      setParticipants,
      setParticipantsSortOrder,
      activeParticipants,
    };
  };

  it('should default sort order to participants state', () => {
    const {result} = renderHook(() => useTestHook(), {
      wrapper: RecoilRoot,
      initialProps: {
        initializeState: ({set}) => {
          set(participantsAtom, {
            ...createParticipant('test-id-1'),
            ...createParticipant('test-id-2'),
          });
        },
        children: null,
      },
    });

    expect(result.current.activeParticipants).toEqual([
      'test-id-1',
      'test-id-2',
    ]);
  });

  it('should not rearange sort order when new participant joins', () => {
    const {result} = renderHook(() => useTestHook(), {
      wrapper: RecoilRoot,
      initialProps: {
        initializeState: ({set}) => {
          set(participantsAtom, {
            ...createParticipant('test-id-1'),
            ...createParticipant('test-id-2'),
          });
          set(participantsSortOrderAtom, ['test-id-2', 'test-id-1']);
        },
        children: null,
      },
    });

    act(() => result.current.setParticipantsSortOrder('test-id-3'));
    act(() =>
      result.current.setParticipants(participants => ({
        ...participants,
        ...createParticipant('test-id-4'),
      })),
    );

    expect(result.current.activeParticipants).toEqual([
      'test-id-3',
      'test-id-2',
      'test-id-1',
    ]);
  });

  it('should not change sort order if participant is already first', () => {
    const {result} = renderHook(() => useTestHook(), {
      wrapper: RecoilRoot,
      initialProps: {
        initializeState: ({set}) => {
          set(participantsSortOrderAtom, ['test-id-2', 'test-id-1']);
        },
        children: null,
      },
    });

    act(() => result.current.setParticipantsSortOrder('test-id-2'));

    expect(result.current.activeParticipants).toEqual([
      'test-id-2',
      'test-id-1',
    ]);
  });

  it('should not change sort order if participant is already second', () => {
    const {result} = renderHook(() => useTestHook(), {
      wrapper: RecoilRoot,
      initialProps: {
        initializeState: ({set}) => {
          set(participantsSortOrderAtom, ['test-id-2', 'test-id-1']);
        },
        children: null,
      },
    });

    act(() => result.current.setParticipantsSortOrder('test-id-1'));

    expect(result.current.activeParticipants).toEqual([
      'test-id-2',
      'test-id-1',
    ]);
  });

  it('should change order if participant is not first or second', () => {
    const {result} = renderHook(() => useTestHook(), {
      wrapper: RecoilRoot,
      initialProps: {
        initializeState: ({set}) => {
          set(participantsSortOrderAtom, ['test-id-2', 'test-id-1']);
        },
        children: null,
      },
    });

    act(() => result.current.setParticipantsSortOrder('test-id-3'));

    expect(result.current.activeParticipants).toEqual([
      'test-id-3',
      'test-id-2',
      'test-id-1',
    ]);
  });
});
