import React from 'react';
import {renderHook} from '@testing-library/react-hooks';
import {RecoilRoot} from 'recoil';

import {sessionAtom} from '../state/state';
import {SessionData} from '../../../../../shared/src/types/Session';

import {userAtom} from '../../../lib/user/state/state';
import {FirebaseAuthTypes} from '@react-native-firebase/auth';
import useIsSessionHost from './useIsSessionHost';

describe('useIsSessionHost', () => {
  it('returns true if current session host matches the current user', async () => {
    const wrapper: React.FC<{children: React.ReactNode}> = ({children}) => (
      <RecoilRoot
        initializeState={({set}) => {
          set(userAtom, {
            uid: 'some-user-id',
          } as FirebaseAuthTypes.User);
          set(sessionAtom, {
            hostId: 'some-user-id',
          } as SessionData);
        }}>
        {children}
      </RecoilRoot>
    );

    const {result} = renderHook(() => useIsSessionHost(), {
      wrapper,
    });

    expect(result.current).toBe(true);
  });

  it('returns true if current session host is not the current user', async () => {
    const wrapper: React.FC<{children: React.ReactNode}> = ({children}) => (
      <RecoilRoot
        initializeState={({set}) => {
          set(userAtom, {
            uid: 'some-user-id',
          } as FirebaseAuthTypes.User);
          set(sessionAtom, {
            hostId: 'some-other-user-id',
          } as SessionData);
        }}>
        {children}
      </RecoilRoot>
    );

    const {result} = renderHook(() => useIsSessionHost(), {
      wrapper,
    });

    expect(result.current).toBe(false);
  });
});
