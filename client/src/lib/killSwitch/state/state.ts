import {atom, selectorFamily} from 'recoil';

const NAMESPACE = 'KillSwitch';

type KillSwitchState = {
  isBlocking: boolean;
  isLoading: boolean;
  requireBundleUpdate: boolean;
  isRetriable: boolean;
  hasFailed: boolean;
  image: string | null;
  message: string | null;
  button: {
    link: string;
    text: string;
  } | null;
};

export const killSwitchAtom = atom<KillSwitchState>({
  key: NAMESPACE,
  default: {
    isBlocking: false,
    isLoading: false,
    isRetriable: false,
    hasFailed: false,
    requireBundleUpdate: false,
    image: null,
    message: null,
    button: null,
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
