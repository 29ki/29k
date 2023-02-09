import {NavigatorScreenParams} from '@react-navigation/native';

import {Exercise} from '../../../../../shared/src/types/generated/Exercise';
import {
  AsyncSession,
  LiveSession,
} from '../../../../../shared/src/types/Session';

export type ProfileStackProps = {
  Profile: undefined;
  EarlyAccessInfo?: {showBack: boolean};
};

export type TabNavigatorProps = {
  ProfileStack: NavigatorScreenParams<ProfileStackProps>;
  Sessions: undefined;
  Journey: undefined;
};

export type LiveSessionStackProps = {
  ChangingRoom: {session: LiveSession};
  Session: {session: LiveSession};
  IntroPortal: {session: LiveSession};
  OutroPortal: {session: LiveSession};
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
  SessionModal: {session: LiveSession};
  CompletedSessionModal: {session: AsyncSession | LiveSession};
  SessionUnavailableModal: undefined;
  AddSessionByInviteModal?: {inviteCode?: number};
  CreateSessionModal: {exerciseId?: Exercise['id']};
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
    sessionId: LiveSession['id'];
    completed: boolean;
    isHost: boolean;
  };
};
