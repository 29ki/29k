import {DailyParticipant} from '@daily-co/react-native-daily-js';
import {prop, uniqBy, values} from 'ramda';
import {atom, selector, selectorFamily} from 'recoil';

const NAMESPACE = 'VideoSharing';

type VideoSharingState = {
  isLoading: boolean;
  isStarted: boolean;
  isJoined: boolean;
};

export const videoSharingAtom = atom<VideoSharingState>({
  key: NAMESPACE,
  default: {
    isLoading: false,
    isStarted: false,
    isJoined: false,
  },
});

export const videoSharingParticipantsAtom = atom<{
  [user_id: string]: DailyParticipant;
}>({
  key: `${NAMESPACE}/participants`,
  default: {},
});

export const videoSharingParticipantsSelector = selector({
  key: `${NAMESPACE}/participantsSelector`,
  get: ({get}) => {
    const participants = values(get(videoSharingParticipantsAtom));
    return uniqBy(prop('session_id'), participants);
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
