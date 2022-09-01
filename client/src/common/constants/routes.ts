export type ScreenProps = {
  Home: undefined;
  Profile: undefined;
  KillSwitch: undefined;
  Tabs: undefined;
  Breathing: undefined;
  Temple: {templeId: string};
  Temples: undefined;
  TempleStack: {screen: string; params: {templeId: string}};
  ChangingRoom: {templeId: string};
};

type Routes = {[key: string]: keyof ScreenProps};

export const NAVIGATORS: Routes = {
  TABS: 'Tabs',
  TEMPLE_STACK: 'TempleStack',
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
