import {NavigatorScreenParams} from '@react-navigation/native';
import {Temple} from '../../../../shared/src/types/Temple';

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

export type ModalStackProps = {
  TempleModal: {temple: Temple};
  CreateTempleModal: undefined;
};

export type RootStackProps = ModalStackProps & {
  KillSwitch: undefined;
  Tabs: NavigatorScreenParams<TabNavigatorProps>;
  TempleStack: NavigatorScreenParams<TempleStackProps>;
};
