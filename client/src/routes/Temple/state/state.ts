import {DailyParticipant} from '@daily-co/react-native-daily-js';
import {prop, uniqBy, values} from 'ramda';
import {atom, selector, selectorFamily} from 'recoil';
import {Temple} from '../../../../../shared/src/types/Temple';

const NAMESPACE = 'VideoSharing';

type VideoSharingState = {
  isLoading: boolean;
  isStarted: boolean;
  isJoined: boolean;
};

export const videoSharingAtom = atom<VideoSharingState>({
  key: `${NAMESPACE}/videoSharing`,
  default: {
    isLoading: false,
    isStarted: false,
    isJoined: false,
  },
});

export const participantsAtom = atom<{
  [user_id: string]: DailyParticipant;
}>({
  key: `${NAMESPACE}/participants`,
  default: {},
});

export const selectedParticipantId = atom<string | null>({
  key: `${NAMESPACE}/selectedParticipantId`,
  default: null,
});

export const selectedParticipantSelector = selector({
  key: `${NAMESPACE}/selectedParticipant`,
  get: ({get}) => {
    const userId = get(selectedParticipantId);
    return userId ? get(participantsAtom)[userId] : null;
  },
});

export const participantsSelector = selector({
  key: `${NAMESPACE}/participantsSelector`,
  get: ({get}) => {
    const participants = values(get(participantsAtom));
    return uniqBy(prop('user_id'), participants);
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
