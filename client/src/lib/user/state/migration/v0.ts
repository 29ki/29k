import {getSession} from '../../../sessions/api/session';
import {V1State, V1UserState} from './v1';

// Types as they were in v0
type V0PinnedSession = {
  id: string;
  expires: Date;
};

type V0CompletedSession = {
  id: string;
  completedAt: string; // is deserialized as string
};

export type V0UserState = {
  pinnedSessions?: Array<V0PinnedSession>;
  completedSessions?: Array<V0CompletedSession>;
  metricsUid?: string;
};

export type V0State = {
  userState: {[key: string]: V0UserState};
};

const migrateCompletedSessions = (
  completedSessions: V0CompletedSession[],
): Promise<V1UserState['completedSessions']> =>
  Promise.all(
    completedSessions.map(async ({id, completedAt}) => {
      const {
        hostId,
        exerciseId: contentId,
        language,
        type,
      } = await getSession(id);

      return {
        id,
        completedAt,
        hostId,
        contentId,
        language,
        type,
      };
    }),
  );

const migrateUserState = async (
  userState: V0UserState,
): Promise<V1UserState> => {
  if (!userState.completedSessions) {
    return userState as V1UserState;
  }

  return {
    ...userState,
    completedSessions: await migrateCompletedSessions(
      userState.completedSessions,
    ),
  };
};

const migrateUserStates = async (
  userStates: V0State['userState'],
): Promise<V1State['userState']> => {
  const userState = await Promise.all(
    Object.entries(userStates).map(
      async ([userId, state]): Promise<[string, V0UserState]> => [
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

export default async (state: V0State): Promise<V1State> => ({
  ...state,
  userState: await migrateUserStates(state.userState),
});
