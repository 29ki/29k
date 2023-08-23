import {DailyParticipant} from '@daily-co/react-native-daily-js';
import {omit, without} from 'ramda';
import {create} from 'zustand';

type State = {
  participants: {
    [session_id: string]: DailyParticipant;
  };
  participantsSortOrder: string[];
  hasFailed: boolean;
};

type Actions = {
  setParticipant: (id: string, participant: DailyParticipant) => void;
  removeParticipant: (id: string) => void;
  setParticipantsSortOrder: (sessionId: string) => void;
  setHasFailed: () => void;
  resetHasFailed: () => void;
  reset: () => void;
};

const initialState: State = {
  participants: {},
  participantsSortOrder: [],
  hasFailed: false,
};

const useDailyState = create<State & Actions>()((set, get) => ({
  ...initialState,

  setParticipant: (id, participant) =>
    set(state => ({
      participants: {
        ...state.participants,
        [id]: participant,
      },
    })),

  removeParticipant: id =>
    set(state => ({
      participants: omit([id], state.participants),
      participantsSortOrder: without([id], state.participantsSortOrder),
    })),

  setParticipantsSortOrder: sessionId => {
    const {participantsSortOrder} = get();
    if (
      sessionId !== participantsSortOrder[0] &&
      sessionId !== participantsSortOrder[1]
    ) {
      set({
        participantsSortOrder: [
          sessionId,
          ...without([sessionId], participantsSortOrder),
        ],
      });
    }
  },

  setHasFailed: () => {
    set({hasFailed: true});
  },

  resetHasFailed: () => {
    set({hasFailed: false});
  },

  reset: () => set(initialState),
}));

export default useDailyState;
