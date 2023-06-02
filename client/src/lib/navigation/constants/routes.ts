import {NavigatorScreenParams} from '@react-navigation/native';

import {Exercise} from '../../../../../shared/src/types/generated/Exercise';
import {
  UserType,
  UserProfileType,
} from '../../../../../shared/src/schemas/User';
import {
  AsyncSessionType,
  LiveSessionType,
  SessionMode,
  SessionType,
} from '../../../../../shared/src/schemas/Session';
import {CompletedSessionEvent} from '../../../../../shared/src/types/Event';

export type TabNavigatorProps = {
  HomeStack: undefined;
  ExploreStack: undefined;
  JourneyStack: undefined;
};

export type HomeStackProps = {
  Home: undefined;
  Collection: {collectionId: string};
};

export type ExploreStackProps = {
  Explore: undefined;
  Collection: {collectionId: string};
};

export type JourneyStackProps = {
  Journey: undefined;
  Collection: {collectionId: string};
};

export type LiveSessionStackProps = {
  ChangingRoom: {session: LiveSessionType};
  Session: {session: LiveSessionType};
  IntroPortal: {session: LiveSessionType};
  OutroPortal: {session: LiveSessionType};
};

export type AsyncSessionStackProps = {
  IntroPortal: {session: AsyncSessionType};
  Session: {session: AsyncSessionType};
  OutroPortal: {session: AsyncSessionType};
};

export type AppStackProps = {
  KillSwitch: undefined;
  Welcome: undefined;
  Onboarding: undefined;
  Tabs?: NavigatorScreenParams<TabNavigatorProps>;
  LiveSessionStack: NavigatorScreenParams<LiveSessionStackProps>;
  AsyncSessionStack: NavigatorScreenParams<AsyncSessionStackProps>;
};

export type OverlayStackProps = {
  App: NavigatorScreenParams<AppStackProps>;
  AboutEditorialOverlay: undefined;
  CommunityEditorialOverlay: undefined;
  AboutOverlay: undefined;
};

export type ModalStackProps = {
  OverlayStack: NavigatorScreenParams<OverlayStackProps>;
  SessionModal: {session: LiveSessionType};
  AssignNewHostModal: {session: LiveSessionType};
  HostSessionByInviteModal: {hostCode: number};
  EditSessionDateModal: {session: LiveSessionType};
  CompletedSessionModal: {
    completedSessionEvent: CompletedSessionEvent;
  };
  SharingModal: {exerciseId: string};
  SharingPostModal: {
    userProfile?: UserProfileType | null;
    text: string;
  };
  SessionUnavailableModal: undefined;
  AddSessionByInviteModal?: {inviteCode?: number};
  CreateSessionModal: {exerciseId?: Exercise['id']};
  UpgradeAccountModal?: undefined;
  RequestPublicHostModal?: {code?: string; haveRequested?: boolean};
  ChangeLanguageModal: undefined;
  RemindersModal: {hideSessionSetting?: boolean} | undefined;
  ProfileSettingsModal: undefined;
  SignInModal: undefined;
  DeleteUserModal: undefined;
  ContributorsModal: undefined;
  HostsModal: undefined;
  PartnersModal: undefined;
  DeveloperModal: undefined;
  ContactModal: undefined;
  SessionFeedbackModal: {
    exerciseId: Exercise['id'];
    sessionId: LiveSessionType['id'];
    completed: boolean;
    isHost: boolean;
    sessionType: SessionType;
    sessionMode: SessionMode;
  };
  SafetyToolkitModal: undefined;
  ReportModal: {originScreen: string};
  CalmDownModal: undefined;
  HostInfoModal: {host: UserType | null};
  CompletedSessionsModal: {
    filterSetting: 'mode' | 'feedback' | 'host';
  };
};

export type RootNavigationProps = ModalStackProps;
