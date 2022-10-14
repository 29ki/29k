import {DailyParticipant} from '@daily-co/react-native-daily-js';
import {omit, values} from 'ramda';
import {atom, selector, selectorFamily} from 'recoil';
import {
  ExerciseStateData,
  SessionData,
} from '../../../../../shared/src/types/Session';

const NAMESPACE = 'VideoSharing';

type VideoSharingState = {
  isLoading: boolean;
  isStarted: boolean;
};

export const videoSharingAtom = atom<VideoSharingState>({
  key: `${NAMESPACE}/videoSharing`,
  default: {
    isLoading: false,
    isStarted: false,
  },
});

export const participantsAtom = atom<{
  [user_id: string]: DailyParticipant | undefined;
}>({
  key: `${NAMESPACE}/participants`,
  default: {},
});

export const participantsSortOrderAtom = atom<Array<string>>({
  key: `${NAMESPACE}/participantsSortOrder`,
  default: selector<Array<string>>({
    key: `${NAMESPACE}/participantIds`,
    get: ({get}) => Object.keys(get(participantsAtom)),
  }),
});

export const participantByIdSelector = selectorFamily({
  key: `${NAMESPACE}/participantById`,
  get:
    (participantId: DailyParticipant['user_id'] | undefined) =>
    ({get}) => {
      if (!participantId) {
        return;
      }

      return get(participantsAtom)[participantId];
    },
});

export const participantsSelector = selector<Array<DailyParticipant>>({
  key: `${NAMESPACE}/participantsSelector`,
  get: ({get}) => {
    const participantsObj = get(participantsAtom);
    const participantsSortOrder = get(participantsSortOrderAtom);

    // When users leaves the call they are sometimes represented as undefined
    // so we need to remove those
    return [
      ...participantsSortOrder.map(id => participantsObj[id]),
      ...values(omit(participantsSortOrder, participantsObj)),
    ].filter(p => p !== undefined) as Array<DailyParticipant>;
  },
});

export const localParticipantSelector = selector<DailyParticipant | null>({
  key: `${NAMESPACE}/localParticipantsSelector`,
  get: ({get}) => {
    const participants = get(participantsAtom);
    return (
      Object.values(participants).find(participant =>
        Boolean(participant?.local),
      ) ?? null
    );
  },
});

export const videoSharingFields = selectorFamily({
  key: `${NAMESPACE}/fields`,
  get:
    (field: keyof VideoSharingState) =>
    ({get}) =>
      get(videoSharingAtom)[field],
  set:
    field =>
    ({set}, newValue) =>
      set(videoSharingAtom, prevState => ({...prevState, [field]: newValue})),
});

export const sessionAtom = atom<SessionData | null>({
  key: `${NAMESPACE}/session`,
  default: null,
});

export const sessionExerciseStateSelector = selector<ExerciseStateData | null>({
  key: `${NAMESPACE}/exerciseStateSelector`,
  get: ({get}) => get(sessionAtom)?.exerciseState || null,
});
