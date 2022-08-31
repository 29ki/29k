export type ScreenProps = {
  Home: undefined;
  Profile: undefined;
  KillSwitch: undefined;
  Tabs: undefined;
  Breathing: undefined;
  Temple: {templeId: string};
  Temples: undefined;
  ChangingRoom: {templeId: string};
};

type Routes = {[key: string]: keyof ScreenProps};

export const NAVIGATORS: Routes = {
  TABS: 'Tabs',
};

export const ROUTES: Routes = {
  HOME: 'Home',
  PROFILE: 'Profile',
  TEMPLE: 'Temple',
  KILL_SWITCH: 'KillSwitch',
  BREATHING: 'Breathing',
  TEMPLES: 'Temples',
  CHANGING_ROOM: 'ChangingRoom',
};
