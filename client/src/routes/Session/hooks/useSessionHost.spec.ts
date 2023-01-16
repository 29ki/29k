import {DailyParticipant} from '@daily-co/react-native-daily-js';
import {renderHook} from '@testing-library/react-hooks';
import useDailyState from '../../../lib/daily/state/state';
import useSessionHost from './useSessionHost';

describe('useSessionHost', () => {
  it('returns the host', () => {
    useDailyState.setState({
      participants: {
        'some-spotlight-user-id': {
          user_id: 'some-spotlight-user-id',
          owner: true,
        } as DailyParticipant,
      },
    });

    const {result} = renderHook(() => useSessionHost());

    expect(result.current).toEqual({
      user_id: 'some-spotlight-user-id',
      owner: true,
    });
  });

  it('returns undefined when no host is found', () => {
    useDailyState.setState({
      participants: {
        'some-spotlight-user-id': {
          user_id: 'some-spotlight-user-id',
          owner: false,
        } as DailyParticipant,
      },
    });

    const {result} = renderHook(() => useSessionHost());

    expect(result.current).toBe(undefined);
  });
});
