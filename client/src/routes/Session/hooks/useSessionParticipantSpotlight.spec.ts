import {DailyParticipant} from '@daily-co/react-native-daily-js';
import {renderHook} from '@testing-library/react-hooks';
import {RecoilRoot} from 'recoil';
import {SessionData} from '../../../../../shared/src/types/Session';
import {sessionAtom} from '../state/state';
import {participantsAtom} from '../../../lib/daily/state/state';
import useSessionParticipantSpotlight from './useSessionParticipantSpotlight';

describe('useSessionParticipantSpotlight', () => {
  it('returns the current participant spotlight', () => {
    const {result} = renderHook(() => useSessionParticipantSpotlight(), {
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
          });
        },
        children: null,
      },
    });

    expect(result.current).toEqual({user_id: 'some-spotlight-user-id'});
  });

  it('returns undefined when no dailySpotlightId is set', () => {
    const {result} = renderHook(() => useSessionParticipantSpotlight(), {
      wrapper: RecoilRoot,
      initialProps: {
        initializeState: ({set}) => {
          set(participantsAtom, {
            'some-spotlight-user-id': {
              user_id: 'some-spotlight-user-id',
            } as DailyParticipant,
          });
        },
        children: null,
      },
    });

    expect(result.current).toBe(undefined);
  });

  it('returns undefined when no matching participant', () => {
    const {result} = renderHook(() => useSessionParticipantSpotlight(), {
      wrapper: RecoilRoot,
      initialProps: {
        initializeState: ({set}) => {
          set(sessionAtom, {
            exerciseState: {
              dailySpotlightId: 'some-spotlight-user-id',
            },
          } as SessionData);

          set(participantsAtom, {
            'some-other-user-id': {
              user_id: 'some-other-user-id',
            } as DailyParticipant,
          });
        },
        children: null,
      },
    });

    expect(result.current).toBe(undefined);
  });
});
