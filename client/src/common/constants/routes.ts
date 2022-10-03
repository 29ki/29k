import {NavigatorScreenParams} from '@react-navigation/native';

export type TabNavigatorProps = {
  Profile: undefined;
  Temples: undefined;
};

export type TempleStackProps = {
  ChangingRoom: {templeId: string};
  Temple: {templeId: string};
  Portal: {templeId: string};
};

export type Modals = {
  TempleModal: {templeId: string};
};

export type RootStackProps = Modals & {
  KillSwitch: undefined;
  Tabs: NavigatorScreenParams<TabNavigatorProps>;
  TempleStack: NavigatorScreenParams<TempleStackProps>;
  Contributors: undefined;
};
