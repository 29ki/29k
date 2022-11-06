import React from 'react';
import {renderHook} from '@testing-library/react-hooks';
import {RecoilRoot} from 'recoil';

import useSessionState, {sessionAtom} from '../state/state';
import {SessionData} from '../../../../../shared/src/types/Session';

import useUserState from '../../../lib/user/state/state';
import {FirebaseAuthTypes} from '@react-native-firebase/auth';
import useIsSessionHost from './useIsSessionHost';

describe('useIsSessionHost', () => {
  it('returns true if current session host matches the current user', async () => {
    useUserState.setState({
      user: {uid: 'some-user-id'} as FirebaseAuthTypes.User,
    });
    useSessionState.setState({
      session: {
        hostId: 'some-user-id',
      } as SessionData,
    });

    const {result} = renderHook(() => useIsSessionHost());

    expect(result.current).toBe(true);
  });

  it('returns true if current session host is not the current user', async () => {
    useUserState.setState({
      user: {uid: 'some-user-id'} as FirebaseAuthTypes.User,
    });
    useSessionState.setState({
      session: {
        hostId: 'some-other-user-id',
      } as SessionData,
    });

    const {result} = renderHook(() => useIsSessionHost());

    expect(result.current).toBe(false);
  });
});
