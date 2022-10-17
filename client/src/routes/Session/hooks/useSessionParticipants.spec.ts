import {DailyParticipant} from '@daily-co/react-native-daily-js';
import {renderHook} from '@testing-library/react-hooks';
import {RecoilRoot} from 'recoil';
import {SessionData} from '../../../../../shared/src/types/Session';
import {participantsAtom, sessionAtom} from '../state/state';
import useSessionExercise from './useSessionExercise';
import useSessionParticipants from './useSessionParticipants';

const mockUseSessionExercise = useSessionExercise as jest.Mock;
jest.mock('./useSessionExercise');

describe('useSessionParticipants', () => {
  it('filter participants if participant is on spotlight', () => {
    mockUseSessionExercise.mockReturnValue({
      slide: {current: {type: 'host'}},
    });

    const {result} = renderHook(() => useSessionParticipants(), {
      wrapper: RecoilRoot,
      initialProps: {
        initializeState: ({set}) => {
          set(sessionAtom, {
            exerciseState: {
              dailySpotlightId: 'some-spotlight-user-id',
            },
          } as SessionData);
          set(participantsAtom, {
            'some-spotlight-user-id': {
              user_id: 'some-spotlight-user-id',
            } as DailyParticipant,
            'some-other-user-id': {
              user_id: 'some-other-user-id',
            } as DailyParticipant,
          });
        },
        children: null,
      },
    });

    expect(result.current).toEqual([{user_id: 'some-other-user-id'}]);
  });

  it('returns all participants when no session spotlight participant', () => {
    mockUseSessionExercise.mockReturnValue({
      slide: {current: {type: 'host'}},
    });

    const {result} = renderHook(() => useSessionParticipants(), {
      wrapper: RecoilRoot,
      initialProps: {
        initializeState: ({set}) => {
          set(participantsAtom, {
            'some-spotlight-user-id': {
              user_id: 'some-spotlight-user-id',
            } as DailyParticipant,
            'some-other-user-id': {
              user_id: 'some-other-user-id',
            } as DailyParticipant,
          });
        },
        children: null,
      },
    });

    expect(result.current).toEqual([
      {user_id: 'some-spotlight-user-id'},
      {user_id: 'some-other-user-id'},
    ]);
  });

  it('returns all participants when content is not ”spotlight type"', () => {
    mockUseSessionExercise.mockReturnValue({
      slide: {current: {type: 'not-host'}},
    });

    const {result} = renderHook(() => useSessionParticipants(), {
      wrapper: RecoilRoot,
      initialProps: {
        initializeState: ({set}) => {
          set(sessionAtom, {
            exerciseState: {
              dailySpotlightId: 'some-spotlight-user-id',
            },
          } as SessionData);
          set(participantsAtom, {
            'some-spotlight-user-id': {
              user_id: 'some-spotlight-user-id',
            } as DailyParticipant,
            'some-other-user-id': {
              user_id: 'some-other-user-id',
            } as DailyParticipant,
          });
        },
        children: null,
      },
    });

    expect(result.current).toEqual([
      {user_id: 'some-spotlight-user-id'},
      {user_id: 'some-other-user-id'},
    ]);
  });

  it('filter participants who are in the portal', () => {
    const {result} = renderHook(() => useSessionParticipants(), {
      wrapper: RecoilRoot,
      initialProps: {
        initializeState: ({set}) => {
          set(participantsAtom, {
            'some-in-portal-user-id': {
              user_id: 'some-in-portal-user-id',
              userData: {inPortal: true},
            } as DailyParticipant,
            'some-not-in-portal-user-id': {
              user_id: 'some-not-in-portal-user-id',
              userData: {inPortal: false},
            } as DailyParticipant,
            'some-without-user-data-user-id': {
              user_id: 'some-without-user-data-user-id',
            } as DailyParticipant,
          });
        },
        children: null,
      },
    });

    expect(result.current).toEqual([
      {user_id: 'some-not-in-portal-user-id', userData: {inPortal: false}},
      {user_id: 'some-without-user-data-user-id'},
    ]);
  });
});
