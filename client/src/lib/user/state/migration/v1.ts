import {LiveSession} from '../../../../../../shared/src/types/Session';
import {
  PersistedState,
  State as CurrentState,
  UserState as CurrentUserState,
} from '../state';

// Types as they were in v1
type V1PinnedSession = {
  id: string;
  expires: Date;
};

type V1CompletedSession = {
  id: LiveSession['id'];
  hostId?: LiveSession['hostId'];
  contentId: LiveSession['exerciseId'];
  language: LiveSession['language'];
  type: LiveSession['type'];
  completedAt: Date;
};

export type V1UserState = {
  pinnedSessions?: Array<V1PinnedSession>;
  completedSessions?: Array<V1CompletedSession>;
  metricsUid?: string;
};

export type V1State = {
  userState: {[key: string]: V1UserState};
};

const migrateCompletedSessions = (
  completedSessions: V1CompletedSession[],
): CurrentUserState['completedSessions'] =>
  completedSessions.map(({contentId, ...rest}) => ({
    ...rest,
    exerciseId: contentId,
  }));

const migrateUserState = async (
  userState: V1UserState,
): Promise<CurrentUserState> => {
  if (!userState.completedSessions) {
    return userState as CurrentUserState;
  }

  return {
    ...userState,
    completedSessions: await migrateCompletedSessions(
      userState.completedSessions,
    ),
  };
};

const migrateUserStates = async (
  userStates: V1State['userState'],
): Promise<CurrentState['userState']> => {
  const userState = await Promise.all(
    Object.entries(userStates).map(
      async ([userId, state]): Promise<[string, CurrentUserState]> => [
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

export default async (state: V1State): Promise<PersistedState> => ({
  ...state,
  userState: await migrateUserStates(state.userState),
});
