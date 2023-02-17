import {omit, uniqBy} from 'ramda';
import {UserEvent as CurrentUserEvent} from '../../../../../../shared/src/types/Event';
import {LANGUAGE_TAG} from '../../../i18n';
import {
  PersistedState,
  State as CurrentState,
  UserState as CurrentUserState,
} from '../state';

// Types as they were in v3
type V3PinnedSession = {
  id: string;
  expires: Date;
};

type V3CompletedSession = {
  id: string;
  hostId?: string;
  exerciseId: string;
  language: LANGUAGE_TAG;
  type: V3SessionType;
  mode: V3SessionMode;
  hostProfile?: V3UserProfile;
  completedAt: Date;
};

type V3UserProfile = {
  displayName?: string;
  photoURL?: string;
};

export enum V3SessionMode {
  async = 'async',
  live = 'live',
}

export enum V3SessionType {
  private = 'private',
  public = 'public',
}

export type V3PostPayload = {
  sessionId: string;
  exerciseId: string;
  sharingId: string;
  isPublic: boolean;
  isAnonymous: boolean;
  text: string;
};

type V3FeedbackPayload = {
  like: boolean;
  text?: string;
};

type V3PostEvent = {
  timestamp: Date;
  type: 'post';
  payload: V3PostPayload;
};

type V3FeedbackEvent = {
  timestamp: Date;
  type: 'feedback';
  payload: V3FeedbackPayload;
};

type V3UserEvent = V3PostEvent | V3FeedbackEvent;

export type V3UserState = {
  pinnedSessions?: Array<V3PinnedSession>;
  completedSessions?: Array<V3CompletedSession>;
  metricsUid?: string;
  userEvents?: Array<V3UserEvent>;
};

export type V3State = {
  userState: {[key: string]: V3UserState};
};

const migrateCompletedSessionsToEvents = (
  completedSessions: V3CompletedSession[],
): CurrentUserEvent[] => {
  const sessions = uniqBy(s => s.id, completedSessions);
  return sessions.map(s => ({
    type: 'completedSession',
    payload: omit(['completedAt'], s),
    timestamp: new Date(s.completedAt),
  })) as unknown as CurrentUserEvent[];
};

const migrateUserState = async (
  userState: V3UserState,
): Promise<CurrentUserState> => {
  if (!userState.completedSessions) {
    return userState as CurrentUserState;
  }

  return {
    ...userState,
    userEvents: [
      ...((userState.userEvents ?? []) as CurrentUserEvent[]),
      ...migrateCompletedSessionsToEvents(userState.completedSessions),
    ],
    completedSessions: undefined,
  } as CurrentUserState;
};

const migrateUserStates = async (
  userStates: V3State['userState'],
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

export default async (state: V3State): Promise<PersistedState> => ({
  ...state,
  userState: await migrateUserStates(state.userState),
});
