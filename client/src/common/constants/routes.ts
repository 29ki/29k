export type ScreenProps = {
  Home: undefined;
  Profile: undefined;
  KillSwitch: undefined;
  Tabs: undefined;
  Breathing: undefined;
};

type Routes = {[key: string]: keyof ScreenProps};

export const NAVIGATORS: Routes = {
  TABS: 'Tabs',
};

export const ROUTES: Routes = {
  HOME: 'Home',
  PROFILE: 'Profile',
  KILL_SWITCH: 'KillSwitch',
  BREATHING: 'Breathing',
};
