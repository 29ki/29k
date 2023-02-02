import {NavigatorScreenParams} from '@react-navigation/native';

import {Exercise} from '../../../../../shared/src/types/generated/Exercise';
import {AsyncSession, Session} from '../../../../../shared/src/types/Session';

export type ProfileStackProps = {
  Profile: undefined;
  EarlyAccessInfo?: {showBack: boolean};
};

export type TabNavigatorProps = {
  ProfileStack: NavigatorScreenParams<ProfileStackProps>;
  Sessions: undefined;
};

export type LiveSessionStackProps = {
  ChangingRoom: {session: Session};
  Session: {session: Session};
  IntroPortal: {session: Session};
  OutroPortal: {session: Session};
};

export type AsyncSessionStackProps = {
  IntroPortal: {session: AsyncSession};
  Session: {session: AsyncSession};
  OutroPortal: {session: AsyncSession};
};

export type AppStackProps = {
  KillSwitch: undefined;
  Welcome?: {showBack: boolean};
  Tabs: NavigatorScreenParams<TabNavigatorProps>;
  LiveSessionStack: NavigatorScreenParams<LiveSessionStackProps>;
  AsyncSessionStack: NavigatorScreenParams<AsyncSessionStackProps>;
};

export type OverlayStackProps = {
  App: NavigatorScreenParams<AppStackProps>;
  AboutOverlay: undefined;
  CommunityOverlay: undefined;
};

export type ModalStackProps = {
  OverlayStack: NavigatorScreenParams<OverlayStackProps>;
  SessionModal: {session: Session};
  AsyncSessionModal: {session: AsyncSession};
  SessionUnavailableModal: undefined;
  AddSessionByInviteModal?: {inviteCode?: number};
  CreateSessionModal: undefined;
  UpgradeAccountModal?: undefined;
  RequestPublicHostModal?: {code?: string; haveRequested?: boolean};
  ChangeLanguageModal: undefined;
  ProfileSettingsModal: undefined;
  SignInModal: undefined;
  ContributorsModal: undefined;
  PartnersModal: undefined;
  DeveloperModal: undefined;
  ContactModal: undefined;
  SessionFeedbackModal: {
    exerciseId: Exercise['id'];
    sessionId: Session['id'];
    completed: boolean;
    isHost: boolean;
  };
};
