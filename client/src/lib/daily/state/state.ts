import {DailyParticipant} from '@daily-co/react-native-daily-js';
import {omit, without} from 'ramda';
import {create} from 'zustand';

type State = {
  participants: {
    [user_id: string]: DailyParticipant;
  };
  participantsSortOrder: string[];
};

type Actions = {
  setParticipant: (id: string, participant: DailyParticipant) => void;
  removeParticipant: (id: string) => void;
  setParticipantsSortOrder: (sessionId: string) => void;
  reset: () => void;
};

const initialState: State = {
  participants: {},
  participantsSortOrder: [],
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
    const {participants, participantsSortOrder} = get();
    const participantsList = Object.values(participants);
    const userId = participantsList.find(
      p => p.session_id === sessionId,
    )?.user_id;

    if (userId) {
      if (
        userId !== participantsSortOrder[0] &&
        userId !== participantsSortOrder[1]
      ) {
        set({
          participantsSortOrder: [
            userId,
            ...without([userId], participantsSortOrder),
          ],
        });
      }
    }
  },

  reset: () => set(initialState),
}));

export default useDailyState;
