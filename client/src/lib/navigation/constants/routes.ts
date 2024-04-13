import {NavigatorScreenParams} from '@react-navigation/native';

import {UserType} from '../../../../../shared/src/schemas/User';
import {
  AsyncSessionType,
  LiveSessionType,
  SessionMode,
  SessionType,
} from '../../../../../shared/src/schemas/Session';
import {
  CompletedSessionEvent,
  FeedbackEvent,
  PostEvent,
} from '../../../../../shared/src/types/Event';
import {PostItem} from '../../posts/types/PostItem';
import {Feedback} from '../../../../../shared/src/types/Feedback';
import {ExerciseWithLanguage} from '../../content/types';

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
  ExploreCategory: {categoryId: string};
  ExploreTag: {tagId: string};
  Collection: {collectionId: string};
};

export type JourneyStackProps = {
  Journey: undefined;
  Collection: {collectionId: string};
};

export type LiveSessionStackProps = {
  ChangingRoom: {session: LiveSessionType; isReJoining?: boolean};
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
  UnlockCollectionModal: {collectionId: string};
  AssignNewHostModal: {session: LiveSessionType};
  HostSessionByInviteModal: {hostingCode: number};
  HostingInviteFailModal: {hostName?: string};
  EditSessionDateModal: {session: LiveSessionType};
  CompletedSessionModal: {
    completedSessionEvent: CompletedSessionEvent;
  };
  LiveSessionsModal: undefined;
  SharingModal: undefined;
  SharingPostModal: {
    sharingPost: PostEvent | PostItem;
    showRelated?: boolean;
  };
  FeedbackPostModal: {
    feedbackPost: FeedbackEvent | Feedback;
  };
  SessionErrorModal: {hasEjected?: boolean} | undefined;
  AddSessionByInviteModal?: {inviteCode?: number};
  CreateSessionModal: {exerciseId?: ExerciseWithLanguage['id']};
  UpgradeAccountModal?: undefined;
  RequestPublicHostModal?: {code?: string; haveRequested?: boolean};
  ChangeLanguageModal: undefined;
  RemindersModal: {hideSessionSetting?: boolean} | undefined;
  ProfileSettingsModal: undefined;
  SimpleProfileSettingsModal: undefined;
  SignInModal: undefined;
  ForgotPasswordModal: undefined;
  DeleteUserModal: undefined;
  ContributorsModal: undefined;
  HostsModal: undefined;
  HowItWorksModal: undefined;
  PartnersModal: undefined;
  DeveloperModal: undefined;
  ContactModal: undefined;
  SessionFeedbackModal: {
    exerciseId: ExerciseWithLanguage['id'];
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
  DonateModal: undefined;
};

export type RootNavigationProps = ModalStackProps;
