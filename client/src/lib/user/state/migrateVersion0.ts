import {getSession} from '../../sessions/api/session';
import {UserState as CurrentUserState} from './state';

type PinnedSession = {
  id: string;
  expires: Date;
};

type CompletedSession = {
  id: string;
  completedAt: Date;
};

type UserState = {
  pinnedSessions?: Array<PinnedSession>;
  completedSessions?: Array<CompletedSession>;
  metricsUid?: string;
};

export const v0 = {
  completedSessions: (
    completedSessions: CompletedSession[],
  ): Promise<CurrentUserState['completedSessions']> =>
    Promise.all(
      completedSessions.map(async ({id, completedAt}) => {
        const {hostId, contentId, language, type} = await getSession(id);

        return {
          id,
          completedAt,
          hostId,
          contentId,
          language,
          type,
        };
      }),
    ),

  migrateState: async (state: UserState): Promise<CurrentUserState> => {
    if (!state.completedSessions) {
      return state as CurrentUserState;
    }

    const completedSessions = await v0.completedSessions(
      state.completedSessions,
    );

    return {
      ...state,
      completedSessions,
    };
  },
};
