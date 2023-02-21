import {DailyParticipant} from '@daily-co/react-native-daily-js';
import {renderHook} from '@testing-library/react-hooks';

import {DailyUserData} from '../../../../../shared/src/types/Session';
import useDailyState from '../../../lib/daily/state/state';
import useSessionSlideState from './useSessionSlideState';
import useSessionParticipants from './useSessionParticipants';

const mockUseSessionSlideState = useSessionSlideState as jest.Mock;
jest.mock('./useSessionSlideState');

const createParticipant = (
  session_id: string,
  userData?: DailyUserData,
  owner = false,
) => ({
  [session_id]: {session_id, owner, userData} as DailyParticipant,
});

describe('useSessionParticipants', () => {
  it('should order participants depending on sort order', () => {
    useDailyState.setState({
      participants: {
        ...createParticipant('test-id-1'),
        ...createParticipant('test-id-2'),
        ...createParticipant('test-id-3'),
      },
      participantsSortOrder: ['test-id-2', 'test-id-3', 'test-id-1'],
    });

    const {result} = renderHook(() => useSessionParticipants());

    expect(result.current).toEqual([
      {session_id: 'test-id-2', owner: false},
      {session_id: 'test-id-3', owner: false},
      {session_id: 'test-id-1', owner: false},
    ]);
  });

  it('filter participants if participant is on spotlight', () => {
    mockUseSessionSlideState.mockReturnValue({
      current: {type: 'host'},
    });

    useDailyState.setState({
      participants: {
        ...createParticipant('some-spotlight-session-id', undefined, true),
        ...createParticipant('some-other-session-id'),
      },
    });

    const {result} = renderHook(() => useSessionParticipants());

    expect(result.current).toEqual([
      {session_id: 'some-other-session-id', owner: false},
    ]);
  });

  it('returns all participants when no session spotlight participant', () => {
    mockUseSessionSlideState.mockReturnValue({
      current: {type: 'host'},
    });

    useDailyState.setState({
      participants: {
        ...createParticipant('some-session-id'),
        ...createParticipant('some-other-session-id'),
      },
    });

    const {result} = renderHook(() => useSessionParticipants());

    expect(result.current).toEqual([
      {session_id: 'some-session-id', owner: false},
      {session_id: 'some-other-session-id', owner: false},
    ]);
  });

  it('returns all participants when content is not ”spotlight type"', () => {
    mockUseSessionSlideState.mockReturnValue({
      current: {type: 'not-host'},
    });

    useDailyState.setState({
      participants: {
        ...createParticipant('some-spotlight-session-id', undefined, true),
        ...createParticipant('some-other-session-id'),
      },
    });

    const {result} = renderHook(() => useSessionParticipants());

    expect(result.current).toEqual([
      {session_id: 'some-spotlight-session-id', owner: true},
      {session_id: 'some-other-session-id', owner: false},
    ]);
  });

  it('filter participants who are in the portal', () => {
    useDailyState.setState({
      participants: {
        ...createParticipant('some-in-portal-session-id', {inPortal: true}),
        ...createParticipant('some-not-in-portal-session-id', {
          inPortal: false,
        }),
        ...createParticipant('some-without-user-data-session-id'),
      },
    });

    const {result} = renderHook(() => useSessionParticipants());

    expect(result.current).toEqual([
      {
        session_id: 'some-not-in-portal-session-id',
        userData: {inPortal: false},
        owner: false,
      },
      {session_id: 'some-without-user-data-session-id', owner: false},
    ]);
  });
});
