import {atom, selectorFamily} from 'recoil';

const NAMESPACE = 'KillSwitch';

type KillSwitchState = {
  isBlocking: boolean;
  isLoading: boolean;
  requiresBundleUpdate: boolean;
  isRetriable: boolean;
  hasFailed: boolean;
};

export const killSwitchAtom = atom<KillSwitchState>({
  key: NAMESPACE,
  default: {
    isBlocking: false,
    isLoading: false,
    hasFailed: false,
    isRetriable: false,
    requiresBundleUpdate: false,
  },
});

export const killSwitchFields = selectorFamily({
  key: `${NAMESPACE}/fields`,
  get:
    (field: keyof KillSwitchState) =>
    ({get}) =>
      get(killSwitchAtom)[field],
  set:
    field =>
    ({set}, newValue) =>
      set(killSwitchAtom, prevState => ({...prevState, [field]: newValue})),
});

type KillSwitchMessageState = {
  image?: string | null;
  message?: string | null;
  button?: {
    link: string;
    text: string;
  } | null;
};

export const killSwitchMessageAtom = atom<KillSwitchMessageState>({
  key: `${NAMESPACE}/message`,
  default: {
    image: null,
    message: null,
    button: null,
  },
});
