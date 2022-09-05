import {DailyParticipant} from '@daily-co/react-native-daily-js';
import {omit, values} from 'ramda';
import {atom, selector, selectorFamily} from 'recoil';
import {Temple} from '../../../../../shared/src/types/Temple';

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

export const localParticipantAtom = atom<DailyParticipant | null>({
  key: `${NAMESPACE}/localParticipant`,
  default: null,
});

export const participantsAtom = atom<{
  [user_id: string]: DailyParticipant | undefined;
}>({
  key: `${NAMESPACE}/participants`,
  default: {},
});

export const selectedParticipantIdAtom = atom<string | null>({
  key: `${NAMESPACE}/selectedParticipantId`,
  default: null,
});

export const activeParticipantAtom = atom<string | null>({
  key: `${NAMESPACE}/activeParticipantId`,
  default: null,
});

export const selectedParticipantSelector = selector({
  key: `${NAMESPACE}/selectedParticipant`,
  get: ({get}) => {
    const userId = get(selectedParticipantIdAtom);
    return userId ? get(participantsAtom)[userId] : null;
  },
});

export const participantsSelector = selector<Array<DailyParticipant>>({
  key: `${NAMESPACE}/participantsSelector`,
  get: ({get}) => {
    const participantsObj = get(participantsAtom);
    const activeParticipantId = get(activeParticipantAtom);
    const localParticipant = participantsObj.local;
    const participants = localParticipant?.user_id
      ? omit([localParticipant?.user_id], participantsObj)
      : participantsObj; // Omit local stream from server

    // When users leaves the call they are sometimes represented as undefined
    // so we need to remove those
    return (
      activeParticipantId
        ? [
            participantsObj[activeParticipantId],
            ...values(omit([activeParticipantId], participants)),
          ]
        : values(participants)
    ).filter(p => p !== undefined) as Array<DailyParticipant>;
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

export const templeAtom = atom<Temple | null>({
  key: `${NAMESPACE}/temple`,
  default: null,
});
