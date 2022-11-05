import {DailyParticipant} from '@daily-co/react-native-daily-js';
import {omit, without} from 'ramda';
import create from 'zustand';

type State = {
  participants: {
    [user_id: string]: DailyParticipant;
  };
  participantsSortOrder: string[];
};

type Actions = {
  setParticipant: (id: string, participant: DailyParticipant) => void;
  removeParticipant: (id: string) => void;
  setParticipantsSortOrder: (sortOrder: State['participantsSortOrder']) => void;
  reset: () => void;
};

const initialState: State = {
  participants: {},
  participantsSortOrder: [],
};

const useDailyState = create<State & Actions>()(set => ({
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

  setParticipantsSortOrder: participantsSortOrder =>
    set({participantsSortOrder}),

  reset: () => set(initialState),
}));

export default useDailyState;
