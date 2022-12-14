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
  Welcome?: {showBack: boolean};
  EarlyAccessInfo?: {showBack: boolean};
  Tabs: NavigatorScreenParams<TabNavigatorProps>;
  SessionStack: NavigatorScreenParams<SessionStackProps>;
};

export type ModalStackProps = {
  App: NavigatorScreenParams<AppStackProps>;
  SessionModal: {session: Session};
  SessionUnavailableModal: undefined;
  AddSessionModal?: {inviteCode?: number};
  CreateSessionModal: undefined;
  UpgradeAccountModal?: {code: string};
  ChangeLanguageModal: undefined;
  ProfileSettingsModal: undefined;
  SignInModal: undefined;
  ContributorsModal: undefined;
  DeveloperModal: undefined;
};
