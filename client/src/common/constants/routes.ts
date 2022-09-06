import {NavigatorScreenParams} from '@react-navigation/native';

export type TabNavigatorProps = {
  ProfileTab: undefined;
  TemplesTab: NavigatorScreenParams<TempleStackProps>;
};

export type TempleStackProps = {
  Temples: undefined;
  Temple: {templeId: string};
  ChangingRoom: {templeId: string};
};

export type RootStackProps = {
  Tabs: undefined;
  KillSwitch: undefined;
};
