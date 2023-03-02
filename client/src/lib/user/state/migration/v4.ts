import {UserEvent} from '../../../../../../shared/src/types/Event';
import {
  SessionMode,
  SessionType,
} from '../../../../../../shared/src/types/Session';
import {
  PersistedState,
  State as CurrentState,
  UserState as CurrentUserState,
} from '../state';

// Types as they were in v4
type PinnedSession = {
  id: string;
  expires: Date;
};

export type V4UserState = {
  pinnedSessions?: Array<PinnedSession>;
  userEvents?: Array<UserEvent>;
  metricsUid?: string;
  reminderNotifications?: boolean;
};

export type V4State = {
  userState: {[key: string]: V4UserState};
};
const migrateUserState = async (
  userState: V4UserState,
): Promise<CurrentUserState> => ({
  ...userState,
  userEvents: userState.userEvents?.map(event =>
    event.type === 'completedSession'
      ? {
          ...event,
          payload: {
            ...event.payload,
            type:
              event.payload.mode === SessionMode.async
                ? SessionType.public
                : event.payload.type,
          },
        }
      : event,
  ),
});

const migrateUserStates = async (
  userStates: V4State['userState'],
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

export default async (state: V4State): Promise<PersistedState> => ({
  ...state,
  userState: await migrateUserStates(state.userState),
});
