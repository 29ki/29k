import {renderHook} from '@testing-library/react-hooks';
import {DailyParticipant} from '@daily-co/react-native-daily-js';

import useIsSessionHost from './useIsSessionHost';
import useDailyState from '../../../lib/daily/state/state';

describe('useIsSessionHost', () => {
  it('returns true if local user is owner', async () => {
    useDailyState.setState({
      participants: {
        'some-user-id': {local: true, owner: true} as DailyParticipant,
      },
    });

    const {result} = renderHook(() => useIsSessionHost());

    expect(result.current).toBe(true);
  });

  it('returns false if local user is not owner', async () => {
    useDailyState.setState({
      participants: {
        'some-user-id': {local: true, owner: false} as DailyParticipant,
      },
    });

    const {result} = renderHook(() => useIsSessionHost());

    expect(result.current).toBe(false);
  });
});
