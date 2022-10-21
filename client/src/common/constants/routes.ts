import {NavigatorScreenParams} from '@react-navigation/native';
import {Session} from '../../../../shared/src/types/Session';

export type TabNavigatorProps = {
  Profile: undefined;
  Sessions: undefined;
};

export type SessionStackProps = {
  ChangingRoom: {sessionId: string};
  Session: {sessionId: string};
  IntroPortal: {sessionId: string};
  OutroPortal: undefined;
};

export type ModalStackProps = {
  SessionModal: {session: Session};
  CreateSessionModal: undefined;
  UpgradeAccount: undefined;
};

export type RootStackProps = ModalStackProps & {
  KillSwitch: undefined;
  Tabs: NavigatorScreenParams<TabNavigatorProps>;
  SessionStack: NavigatorScreenParams<SessionStackProps>;
};
