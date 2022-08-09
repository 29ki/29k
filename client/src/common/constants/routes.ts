export type ScreenProps = {
  Home: undefined;
  Profile: undefined;
  KillSwitch: undefined;
  Tabs: undefined;
  Breathing: undefined;
  Video: {url: string; templeId: string};
  Temples: undefined;
};

type Routes = {[key: string]: keyof ScreenProps};

export const NAVIGATORS: Routes = {
  TABS: 'Tabs',
};

export const ROUTES: Routes = {
  HOME: 'Home',
  PROFILE: 'Profile',
  VIDEO: 'Video',
  KILL_SWITCH: 'KillSwitch',
  BREATHING: 'Breathing',
  TEMPLES: 'Temples',
};
