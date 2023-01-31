import {PersistOptions} from 'zustand/middleware';

import migrateV0 from './v0';
import {Actions, PersistedState, State, UserState} from '../state';

const migrate: Required<
  PersistOptions<State & Actions, PersistedState>
>['migrate'] = async (persistedState, version) => {
  const {userState} = persistedState as PersistedState;

  if (version === 0) {
    const newState: State['userState'] = {};
    for (const [userId, state] of Object.entries(userState)) {
      newState[userId] = await migrateV0(state as UserState);
    }
    return {userState: newState} as unknown as State & Actions;
  }

  return {userState} as unknown as State & Actions;
};

export default migrate;
