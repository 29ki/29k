import {PersistOptions} from 'zustand/middleware';

import {Actions, PersistedState, State} from '../state';
import migrateV0, {V0State} from './v0';
import migrateV1, {V1State} from './v1';
import migrateV2, {V2State} from './v2';
import migrateV3, {V3State} from './v3';
import migrateV4, {V4State} from './v4';

const migrate: Required<
  PersistOptions<State & Actions, PersistedState>
>['migrate'] = async (persistedState, version) => {
  let state = persistedState;

  if (version === 0) {
    state = await migrateV0(state as V0State);
  }

  if (version <= 1) {
    state = await migrateV1(state as V1State);
  }

  if (version <= 2) {
    state = await migrateV2(state as V2State);
  }

  if (version <= 3) {
    state = await migrateV3(state as V3State);
  }

  if (version <= 4) {
    state = await migrateV4(state as V4State);
  }

  return state as State & Actions;
};

export default migrate;
