import {DailyParticipant} from '@daily-co/react-native-daily-js';
import {renderHook} from '@testing-library/react-hooks';
import {RecoilRoot} from 'recoil';
import {SessionData} from '../../../../../shared/src/types/Session';
import {sessionAtom} from '../state/state';
import useDailyState from '../../../lib/daily/state/state';
import useSessionParticipantSpotlight from './useSessionParticipantSpotlight';

describe('useSessionParticipantSpotlight', () => {
  it('returns the current participant spotlight', () => {
    useDailyState.setState({
      participants: {
        'some-spotlight-user-id': {
          user_id: 'some-spotlight-user-id',
        } as DailyParticipant,
      },
    });

    const {result} = renderHook(() => useSessionParticipantSpotlight(), {
      wrapper: RecoilRoot,
      initialProps: {
        initializeState: ({set}) => {
          set(sessionAtom, {
            exerciseState: {
              dailySpotlightId: 'some-spotlight-user-id',
            },
          } as SessionData);
        },
        children: null,
      },
    });

    expect(result.current).toEqual({user_id: 'some-spotlight-user-id'});
  });

  it('returns undefined when no dailySpotlightId is set', () => {
    useDailyState.setState({
      participants: {
        'some-spotlight-user-id': {
          user_id: 'some-spotlight-user-id',
        } as DailyParticipant,
      },
    });

    const {result} = renderHook(() => useSessionParticipantSpotlight(), {
      wrapper: RecoilRoot,
    });

    expect(result.current).toBe(undefined);
  });

  it('returns undefined when no matching participant', () => {
    useDailyState.setState({
      participants: {
        'some-other-user-id': {
          user_id: 'some-other-user-id',
        } as DailyParticipant,
      },
    });

    const {result} = renderHook(() => useSessionParticipantSpotlight(), {
      wrapper: RecoilRoot,
    });

    expect(result.current).toBe(undefined);
  });
});
