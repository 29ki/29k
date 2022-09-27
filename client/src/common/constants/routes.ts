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

export type ModalStackProps = {
  TempleModal: {templeId: string};
  CreateTempleModal: undefined;
};

export type RootStackProps = ModalStackProps & {
  KillSwitch: undefined;
  Tabs: NavigatorScreenParams<TabNavigatorProps>;
  TempleStack: NavigatorScreenParams<TempleStackProps>;
};
