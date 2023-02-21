import {DailyParticipant} from '@daily-co/react-native-daily-js';
import {renderHook} from '@testing-library/react-hooks';
import useDailyState from '../../../lib/daily/state/state';
import useSessionHost from './useSessionHost';

describe('useSessionHost', () => {
  it('returns the host', () => {
    useDailyState.setState({
      participants: {
        'some-spotlight-session-id': {
          session_id: 'some-spotlight-session-id',
          owner: true,
        } as DailyParticipant,
      },
    });

    const {result} = renderHook(() => useSessionHost());

    expect(result.current).toEqual({
      session_id: 'some-spotlight-session-id',
      owner: true,
    });
  });

  it('returns undefined when no host is found', () => {
    useDailyState.setState({
      participants: {
        'some-spotlight-session-id': {
          session_id: 'some-spotlight-session-id',
          owner: false,
        } as DailyParticipant,
      },
    });

    const {result} = renderHook(() => useSessionHost());

    expect(result.current).toBe(undefined);
  });
});
