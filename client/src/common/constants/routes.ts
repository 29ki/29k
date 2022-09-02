import {NavigatorScreenParams} from '@react-navigation/native';

export type TempleStackProps = {
  Temple: {templeId: string};
  ChangingRoom: {templeId: string};
};

export type RootStackProps = {
  Home: undefined;
  Profile: undefined;
  KillSwitch: undefined;
  Tabs: undefined;
  Breathing: undefined;
  Temples: undefined;
  TempleStack: NavigatorScreenParams<TempleStackProps>;
};

export const TempleStackRoutes: {[key: string]: keyof TempleStackProps} = {
  TEMPLE: 'Temple',
  CHANGING_ROOM: 'ChangingRoom',
};

export const RootStackRoutes: {[key: string]: keyof RootStackProps} = {
  HOME: 'Home',
  PROFILE: 'Profile',
  KILL_SWITCH: 'KillSwitch',
  BREATHING: 'Breathing',
  TEMPLES: 'Temples',
  TABS: 'Tabs',
  TEMPLE_STACK: 'TempleStack',
};
