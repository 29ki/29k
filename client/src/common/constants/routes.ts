import {NavigatorScreenParams} from '@react-navigation/native';
import {Temple} from '../../../../shared/src/types/Temple';

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
  TempleModal: {temple: Temple};
};

export type RootStackProps = Modals & {
  KillSwitch: undefined;
  Tabs: NavigatorScreenParams<TabNavigatorProps>;
  TempleStack: NavigatorScreenParams<TempleStackProps>;
};
