import {DailyParticipant} from '@daily-co/react-native-daily-js';
import {renderHook} from '@testing-library/react-hooks';

import {DailyUserData} from '../../../../../shared/src/types/Session';
import useDailyState from '../../../lib/daily/state/state';
import useSessionSlideState from './useSessionSlideState';
import useSessionParticipants from './useSessionParticipants';

const mockUseSessionSlideState = useSessionSlideState as jest.Mock;
jest.mock('./useSessionSlideState');

const createParticipant = (
  id: string,
  userData?: DailyUserData,
  owner = false,
) => ({
  [id]: {user_id: id, owner, userData} as DailyParticipant,
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
      {user_id: 'test-id-2', owner: false},
      {user_id: 'test-id-3', owner: false},
      {user_id: 'test-id-1', owner: false},
    ]);
  });

  it('filter participants if participant is on spotlight', () => {
    mockUseSessionSlideState.mockReturnValue({
      current: {type: 'host'},
    });

    useDailyState.setState({
      participants: {
        ...createParticipant('some-spotlight-user-id', undefined, true),
        ...createParticipant('some-other-user-id'),
      },
    });

    const {result} = renderHook(() => useSessionParticipants());

    expect(result.current).toEqual([
      {user_id: 'some-other-user-id', owner: false},
    ]);
  });

  it('returns all participants when no session spotlight participant', () => {
    mockUseSessionSlideState.mockReturnValue({
      current: {type: 'host'},
    });

    useDailyState.setState({
      participants: {
        ...createParticipant('some-user-id'),
        ...createParticipant('some-other-user-id'),
      },
    });

    const {result} = renderHook(() => useSessionParticipants());

    expect(result.current).toEqual([
      {user_id: 'some-user-id', owner: false},
      {user_id: 'some-other-user-id', owner: false},
    ]);
  });

  it('returns all participants when content is not ”spotlight type"', () => {
    mockUseSessionSlideState.mockReturnValue({
      current: {type: 'not-host'},
    });

    useDailyState.setState({
      participants: {
        ...createParticipant('some-spotlight-user-id', undefined, true),
        ...createParticipant('some-other-user-id'),
      },
    });

    const {result} = renderHook(() => useSessionParticipants());

    expect(result.current).toEqual([
      {user_id: 'some-spotlight-user-id', owner: true},
      {user_id: 'some-other-user-id', owner: false},
    ]);
  });

  it('filter participants who are in the portal', () => {
    useDailyState.setState({
      participants: {
        ...createParticipant('some-in-portal-user-id', {inPortal: true}),
        ...createParticipant('some-not-in-portal-user-id', {inPortal: false}),
        ...createParticipant('some-without-user-data-user-id'),
      },
    });

    const {result} = renderHook(() => useSessionParticipants());

    expect(result.current).toEqual([
      {
        user_id: 'some-not-in-portal-user-id',
        userData: {inPortal: false},
        owner: false,
      },
      {user_id: 'some-without-user-data-user-id', owner: false},
    ]);
  });
});
