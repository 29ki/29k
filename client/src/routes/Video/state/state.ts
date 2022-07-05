import {DailyParticipant} from '@daily-co/react-native-daily-js';
import {atom, selectorFamily, SetterOrUpdater} from 'recoil';

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
