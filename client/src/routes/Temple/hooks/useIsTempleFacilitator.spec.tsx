import React from 'react';
import {renderHook} from '@testing-library/react-hooks';
import {RecoilRoot} from 'recoil';

import {templeAtom} from '../state/state';
import {TempleData} from '../../../../../shared/src/types/Temple';

import {userAtom} from '../../../lib/user/state/state';
import {FirebaseAuthTypes} from '@react-native-firebase/auth';
import useIsTempleFacilitator from './useIsTempleFacilitator';

describe('useIsTempleFacilitator', () => {
  it('returns true if current temple facilitator matches the current user', async () => {
    const wrapper: React.FC<{children: React.ReactNode}> = ({children}) => (
      <RecoilRoot
        initializeState={({set}) => {
          set(userAtom, {
            uid: 'some-user-id',
          } as FirebaseAuthTypes.User);
          set(templeAtom, {
            facilitator: 'some-user-id',
          } as TempleData);
        }}>
        {children}
      </RecoilRoot>
    );

    const {result} = renderHook(() => useIsTempleFacilitator(), {
      wrapper,
    });

    expect(result.current).toBe(true);
  });

  it('returns true if current temple facilitator is not the current user', async () => {
    const wrapper: React.FC<{children: React.ReactNode}> = ({children}) => (
      <RecoilRoot
        initializeState={({set}) => {
          set(userAtom, {
            uid: 'some-user-id',
          } as FirebaseAuthTypes.User);
          set(templeAtom, {
            facilitator: 'some-other-user-id',
          } as TempleData);
        }}>
        {children}
      </RecoilRoot>
    );

    const {result} = renderHook(() => useIsTempleFacilitator(), {
      wrapper,
    });

    expect(result.current).toBe(false);
  });
});
