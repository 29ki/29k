import {NavigatorScreenParams} from '@react-navigation/native';
import {Session} from '../../../../../shared/src/types/Session';

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

export type AppStackProps = {
  KillSwitch: undefined;
  Tabs: NavigatorScreenParams<TabNavigatorProps>;
  SessionStack: NavigatorScreenParams<SessionStackProps>;
};

export type ModalStackProps = {
  App: NavigatorScreenParams<AppStackProps>;
  SessionModal: {session: Session};
  SessionUnavailableModal: undefined;
  CreateSessionModal: undefined;
  UpgradeAccountModal: {code: string} | undefined;
  JoinSessionModal: {inviteCode?: number};
  AddSessionModal: undefined;
};
