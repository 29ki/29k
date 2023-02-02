import {getSession} from '../../../sessions/api/session';
import {UserState as CurrentUserState} from '../state';

// Types as they were in v0
type PinnedSession = {
  id: string;
  expires: Date;
};

type CompletedSession = {
  id: string;
  completedAt: Date;
};

export type UserState = {
  pinnedSessions?: Array<PinnedSession>;
  completedSessions?: Array<CompletedSession>;
  metricsUid?: string;
};

const migrateCompletedSessions = (
  completedSessions: CompletedSession[],
): Promise<CurrentUserState['completedSessions']> =>
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

export default async (state: UserState): Promise<CurrentUserState> => {
  if (!state.completedSessions) {
    return state as CurrentUserState;
  }

  const completedSessions = await migrateCompletedSessions(
    state.completedSessions,
  );

  return {
    ...state,
    completedSessions,
  };
};
