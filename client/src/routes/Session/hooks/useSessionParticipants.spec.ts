import {DailyParticipant} from '@daily-co/react-native-daily-js';
import {renderHook} from '@testing-library/react-hooks';
import {RecoilRoot} from 'recoil';
import {SessionData} from '../../../../../shared/src/types/Session';
import {sessionAtom} from '../state/state';
import useDailyState from '../../../lib/daily/state/state';
import useSessionExercise from './useSessionExercise';
import useSessionParticipants from './useSessionParticipants';

const mockUseSessionExercise = useSessionExercise as jest.Mock;
jest.mock('./useSessionExercise');

describe('useSessionParticipants', () => {
  it('filter participants if participant is on spotlight', () => {
    mockUseSessionExercise.mockReturnValue({
      slide: {current: {type: 'host'}},
    });

    useDailyState.setState({
      participants: {
        'some-spotlight-user-id': {
          user_id: 'some-spotlight-user-id',
        } as DailyParticipant,
        'some-other-user-id': {
          user_id: 'some-other-user-id',
        } as DailyParticipant,
      },
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

    useDailyState.setState({
      participants: {
        'some-spotlight-user-id': {
          user_id: 'some-spotlight-user-id',
        } as DailyParticipant,
        'some-other-user-id': {
          user_id: 'some-other-user-id',
        } as DailyParticipant,
      },
    });

    const {result} = renderHook(() => useSessionParticipants(), {
      wrapper: RecoilRoot,
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

    useDailyState.setState({
      participants: {
        'some-spotlight-user-id': {
          user_id: 'some-spotlight-user-id',
        } as DailyParticipant,
        'some-other-user-id': {
          user_id: 'some-other-user-id',
        } as DailyParticipant,
      },
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
    useDailyState.setState({
      participants: {
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
      },
    });

    const {result} = renderHook(() => useSessionParticipants(), {
      wrapper: RecoilRoot,
    });

    expect(result.current).toEqual([
      {user_id: 'some-not-in-portal-user-id', userData: {inPortal: false}},
      {user_id: 'some-without-user-data-user-id'},
    ]);
  });
});
