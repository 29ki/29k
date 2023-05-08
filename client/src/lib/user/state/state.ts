import {FirebaseAuthTypes} from '@react-native-firebase/auth';
import {create} from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {createJSONStorage, persist} from 'zustand/middleware';
import {equals, omit} from 'ramda';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';

import migrate from './migration';
import {
  UserEvent,
  UserEventData,
  FeedbackEventData,
  PostEventData,
  CompletedSessionEventData,
  CompletedCollectionEventData,
  CompletedSessionPayload,
} from '../../../../../shared/src/types/Event';
import {UserDataType} from '../../../../../shared/src/schemas/User';
import {Collection} from '../../../../../shared/src/types/generated/Collection';
import {GET_STARTED_COLLECTION_ID} from '../../content/constants';

dayjs.extend(utc);

const USER_STATE_VERSION = 5;

type PinnedSession = {
  id: string;
  expires: Date;
};

export type PinnedCollection = {
  id: string;
  startedAt: string;
};

export type UserState = {
  pinnedSessions?: Array<PinnedSession>;
  pinnedCollections?: Array<PinnedCollection>;
  userEvents?: Array<UserEvent>;
  metricsUid?: string;
  reminderNotifications?: boolean;
};

type SetCurrentUserState = (
  setter:
    | Partial<UserState>
    | ((userState: Partial<UserState>) => Partial<UserState>),
) => void;

export type State = {
  user: FirebaseAuthTypes.User | null;
  data: UserDataType | null;
  claims: FirebaseAuthTypes.IdTokenResult['claims'];
  userState: {[key: string]: UserState};
};

export type PersistedState = Pick<State, 'userState'>;

export type Actions = {
  setUser: (user: State['user']) => void;
  setClaims: (claims: State['claims']) => void;
  setData: (data: Partial<UserDataType>) => void;
  setUserAndClaims: (state: {
    user: State['user'];
    claims: State['claims'];
  }) => void;
  setIntialState: () => void;
  setPinnedSessions: (pinnedSessions: Array<PinnedSession>) => void;
  setPinnedCollections: (pinnedCollections: Array<PinnedCollection>) => void;
  addUserEvent: (
    type: UserEvent['type'],
    payload: UserEvent['payload'],
  ) => void;
  addCompletedSessionEvent: (
    payload: CompletedSessionPayload,
    collections: Array<Collection>,
  ) => void;
  setCurrentUserState: SetCurrentUserState;
  reset: (isDelete?: boolean) => void;
};

const createInitialUserState = (timestamp: string): UserState => ({
  pinnedCollections: [{id: GET_STARTED_COLLECTION_ID, startedAt: timestamp}],
});

const initialState: State = {
  user: null,
  data: null,
  claims: {},
  userState: {},
};

// We don't use selectors but for this case we do :)
// This should only be used in hooks where we can memoize with useCallback or useMemo
type GetCurrentUserStateSelector = (state: State) => UserState | undefined;
export const getCurrentUserStateSelector: GetCurrentUserStateSelector = ({
  user,
  userState,
}) => {
  if (user?.uid) {
    return userState[user.uid];
  }
};

const getTypedEvent = (event: UserEventData) => {
  switch (event.type) {
    case 'post':
      return event as PostEventData;
    case 'completedSession':
      return event as CompletedSessionEventData;
    case 'completedCollection':
      return event as CompletedCollectionEventData;
    default:
      return event as FeedbackEventData; // some type has to be the fallback
  }
};

const useUserState = create<State & Actions>()(
  persist(
    (set, get) => {
      const setCurrentUserState: SetCurrentUserState = setter => {
        const {user} = get();
        if (user?.uid) {
          const currentState = getCurrentUserStateSelector(get()) ?? {};
          const newState =
            typeof setter === 'function' ? setter(currentState) : setter;

          set(({userState}) => ({
            userState: {
              ...userState,
              [user.uid]: {
                ...currentState,
                ...newState,
              },
            },
          }));
        }
      };

      const addUserEvent = (
        type: UserEvent['type'],
        payload: UserEvent['payload'],
      ) => {
        const typedEventData = getTypedEvent({type, payload});
        setCurrentUserState(({userEvents: events = []} = {}) => ({
          userEvents: [
            ...events,
            {...typedEventData, timestamp: dayjs().utc().toJSON()},
          ],
        }));
      };

      return {
        ...initialState,
        setUser: user => set({user}),
        setData: data => set(state => ({data: {...state.data, ...data}})),
        setClaims: claims => set({claims}),
        setUserAndClaims: ({user, claims}) => {
          set({user, claims});
        },
        setIntialState: () => {
          const currentState = getCurrentUserStateSelector(get());
          if (!currentState?.pinnedCollections) {
            setCurrentUserState(createInitialUserState(dayjs().utc().toJSON()));
          }
        },
        setCurrentUserState,
        setPinnedSessions: pinnedSessions =>
          setCurrentUserState({pinnedSessions}),
        setPinnedCollections: pinnedCollections =>
          setCurrentUserState({pinnedCollections}),
        addUserEvent,
        addCompletedSessionEvent: (payload, collections) => {
          addUserEvent('completedSession', payload);
          const currentState = getCurrentUserStateSelector(get()) ?? {};
          const collectionIds = collections.map(c => c.id);
          const pinnedCollections =
            currentState.pinnedCollections?.filter(c =>
              collectionIds.includes(c.id),
            ) ?? [];

          for (const pinnedCollection of pinnedCollections) {
            const collection = collections.find(
              c => c.id === pinnedCollection.id,
            );
            const completedExerciseIds = currentState.userEvents
              ?.filter(
                e =>
                  e.type === 'completedSession' &&
                  collection?.exercises.includes(e.payload.exerciseId) &&
                  dayjs(e.timestamp).isAfter(dayjs(pinnedCollection.startedAt)),
              )
              .map(e => (e.payload as CompletedSessionPayload).exerciseId)
              .sort();
            const collectionExerciseIds = collection?.exercises.sort();

            if (equals(collectionExerciseIds, completedExerciseIds)) {
              addUserEvent('completedCollection', {id: pinnedCollection.id});
            }
          }
        },
        reset: isDelete => {
          const {user} = get();
          if (isDelete && user?.uid) {
            // Remove the state specific to the user on delete
            set(({userState}) => ({
              ...initialState,
              userState: omit([user.uid], userState),
            }));
          } else {
            // Keep persisted state in case of sign out
            set(({userState}) => ({...initialState, userState}));
          }
        },
      };
    },
    {
      name: 'userState',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: ({userState}): PersistedState => ({userState}),
      // In dev I had change this with the app closed (android)
      // otherwise the "migrate" functions does not run due to diff failure
      version: USER_STATE_VERSION,
      migrate,
    },
  ),
);

export default useUserState;
