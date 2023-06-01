import {UserEvent} from '../../../../../../shared/src/types/Event';
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

export type V5UserState = {
  pinnedSessions?: Array<PinnedSession>;
  userEvents?: Array<UserEvent>;
  metricsUid?: string;
  reminderNotifications?: boolean;
};

export type V5State = {
  userState: {[key: string]: V5UserState};
};

const migrateUserState = async ({
  reminderNotifications,
  ...userState
}: V5UserState): Promise<CurrentUserState> => ({
  ...userState,
  sessionReminderNotifications: reminderNotifications,
});

const migrateUserStates = async (
  userStates: V5State['userState'],
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

export default async (state: V5State): Promise<PersistedState> => ({
  ...state,
  userState: await migrateUserStates(state.userState),
});
