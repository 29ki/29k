import {NavigatorScreenParams} from '@react-navigation/native';

export type TabNavigatorProps = {
  Profile: undefined;
  Temples: undefined;
};

export type TempleStackProps = {
  ChangingRoom: {templeId: string};
  Temple: {templeId: string};
  IntroPortal: {templeId: string};
  OutroPortal: undefined;
};

export type Modals = {
  TempleModal: {templeId: string};
};

export type RootStackProps = Modals & {
  KillSwitch: undefined;
  Tabs: NavigatorScreenParams<TabNavigatorProps>;
  TempleStack: NavigatorScreenParams<TempleStackProps>;
};
