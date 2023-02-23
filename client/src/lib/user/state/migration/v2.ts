import {LiveSession} from '../../../../../../shared/src/types/Session';
import {V3SessionMode, V3SessionType, V3State, V3UserState} from './v3';

// Types as they were in v2
type V2PinnedSession = {
  id: string;
  expires: Date;
};

type V2CompletedSession = {
  id: LiveSession['id'];
  hostId?: LiveSession['hostId'];
  exerciseId: LiveSession['exerciseId'];
  language: LiveSession['language'];
  type: 'public' | 'private' | 'async';
  completedAt: string; // is deserialized as string
};

export type V2UserState = {
  pinnedSessions?: Array<V2PinnedSession>;
  completedSessions?: Array<V2CompletedSession>;
  metricsUid?: string;
};

export type V2State = {
  userState: {[key: string]: V2UserState};
};

const migrateCompletedSessions = (
  completedSessions: V2CompletedSession[],
): V3UserState['completedSessions'] =>
  completedSessions.map(({type, ...rest}) => ({
    ...rest,
    type: type === 'async' ? V3SessionType.public : V3SessionType[type],
    mode: type === 'async' ? V3SessionMode.async : V3SessionMode.live,
  }));

const migrateUserState = async (
  userState: V2UserState,
): Promise<V3UserState> => {
  if (!userState.completedSessions) {
    return userState as V3UserState;
  }

  return {
    ...userState,
    completedSessions: await migrateCompletedSessions(
      userState.completedSessions,
    ),
  };
};

const migrateUserStates = async (
  userStates: V2State['userState'],
): Promise<V3State['userState']> => {
  const userState = await Promise.all(
    Object.entries(userStates).map(
      async ([userId, state]): Promise<[string, V3UserState]> => [
        userId,
        await migrateUserState(state),
      ],
    ),
  );

  return userState.reduce(
    (states, [userId, state]) => ({
      ...states,
      [userId]: state,
    }),
    {},
  );
};

export default async (state: V2State): Promise<V3State> => ({
  ...state,
  userState: await migrateUserStates(state.userState),
});
