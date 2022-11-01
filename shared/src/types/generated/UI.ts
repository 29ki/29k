/* eslint-disable */
/* tslint:disable */

export interface ComponentAddToCalendar {
  title?: string;
  notes?: string;
  location?: string;
}

export interface ComponentCodePushOverlayDownloading {
  title?: string;
  text?: string;
}

export interface ComponentCodePushOverlayInstall {
  title?: string;
  text?: string;
  dismiss_button?: string;
  restart_button?: string;
}

export interface ComponentCodePushOverlay {
  downloading: ComponentCodePushOverlayDownloading;
  install: ComponentCodePushOverlayInstall;
}

export interface ComponentConfirmExitSessionButtons {
  cancel?: string;
  confirm?: string;
}

export interface ComponentConfirmExitSession {
  header?: string;
  text?: string;
  buttons: ComponentConfirmExitSessionButtons;
}

export interface ComponentCounterCounterValue {
  shortly?: string;
  now?: string;
  inHours?: string;
  inMinutes?: string;
}

export interface ComponentCounter {
  counterValue: ComponentCounterCounterValue;
  today?: string;
}

export interface ComponentCrashErrorMessage {
  text__markdown?: string;
}

export interface ComponentCreateSessionModalSelectContent {
  title?: string;
}

export interface ComponentCreateSessionModalSelectTypePublic {
  title?: string;
  icon?: string;
}

export interface ComponentCreateSessionModalSelectTypePrivate {
  title?: string;
  icon?: string;
}

export interface ComponentCreateSessionModalSelectTypeAsync {
  title?: string;
  icon?: string;
}

export interface ComponentCreateSessionModalSelectType {
  title?: string;
  public: ComponentCreateSessionModalSelectTypePublic;
  private: ComponentCreateSessionModalSelectTypePrivate;
  async: ComponentCreateSessionModalSelectTypeAsync;
}

export interface ComponentCreateSessionModalSetDateTime {
  title?: string;
  cta?: string;
}

export interface ComponentCreateSessionModal {
  selectContent: ComponentCreateSessionModalSelectContent;
  selectType: ComponentCreateSessionModalSelectType;
  setDateTime: ComponentCreateSessionModalSetDateTime;
}

export interface ComponentDateTimePicker {
  date?: string;
  time?: string;
  done?: string;
}

export interface ComponentHostNotes {
  notes?: string;
}

export interface ComponentJoinSessionModal {
  title?: string;
}

export interface ComponentSessionCard {
  addToCalendar?: string;
  join?: string;
  starts?: string;
}

export interface ComponentSessionModalDeleteButtons {
  cancel?: string;
  confirm?: string;
}

export interface ComponentSessionModalDelete {
  header?: string;
  text?: string;
  buttons: ComponentSessionModalDeleteButtons;
}

export interface ComponentSessionModal {
  edit?: string;
  done?: string;
  deleteButton?: string;
  delete: ComponentSessionModalDelete;
  addToCalendar?: string;
  addReminder?: string;
  join?: string;
  shareMessage?: string;
}

export interface ComponentSessionReminder {
  title?: string;
}

export interface ComponentTabs {
  home?: string;
  profile?: string;
}

export interface ComponentVerificationCode {
  pasteButton?: string;
}

export interface ComponentVerificationModal {
  header?: string;
  email?: string;
  password?: string;
  upgrade?: string;
  code?: string;
  signIn?: string;
}

export interface DeepLinkJoinSessionInvite {
  title?: string;
  description?: string;
}

export interface ScreenChangingRoomPermissionsAlert {
  title?: string;
  message?: string;
  join?: string;
  openSettings?: string;
}

export interface ScreenChangingRoom {
  placeholder?: string;
  join_button?: string;
  cameraOff?: string;
  permissionsAlert: ScreenChangingRoomPermissionsAlert;
}

export interface ScreenHome {
  heading?: string;
  button?: string;
}

export interface ScreenKillSwitchUpdateAndroid {
  text__markdown?: string;
  link?: string;
  button?: string;
}

export interface ScreenKillSwitchUpdateIos {
  text__markdown?: string;
  link?: string;
  button?: string;
}

export interface ScreenKillSwitchUpdate {
  image__image?: string;
  android: ScreenKillSwitchUpdateAndroid;
  ios: ScreenKillSwitchUpdateIos;
}

export interface ScreenKillSwitchMaintenance {
  image__image?: string;
  text__markdown?: string;
}

export interface ScreenKillSwitchFailed {
  image__image?: string;
  text__markdown?: string;
}

export interface ScreenKillSwitch {
  update: ScreenKillSwitchUpdate;
  maintenance: ScreenKillSwitchMaintenance;
  failed: ScreenKillSwitchFailed;
  retry?: string;
}

export interface ScreenPortalCounterLabel {
  counting?: string;
  soon?: string;
}

export interface ScreenPortalCounterValue {
  shortly?: string;
  now?: string;
}

export interface ScreenPortal {
  participants?: string;
  startSession?: string;
  sessionStarted?: string;
  skipPortal?: string;
  counterLabel: ScreenPortalCounterLabel;
  counterValue: ScreenPortalCounterValue;
}

export interface ScreenProfile {
  signIn?: string;
  or?: string;
  userId?: string;
  requestPublicHostRoleButton?: string;
  signOut?: string;
  uiLib?: string;
  checkUpdate?: string;
  clearUpdate?: string;
  signInAnonymously?: string;
  language?: string;
  password?: string;
  upgrade?: string;
  email?: string;
}

export interface ScreenSessionControls {
  start?: string;
  next?: string;
  prev?: string;
}

export interface ScreenSession {
  nameSuffix?: string;
  endButton?: string;
  controls: ScreenSessionControls;
}

export interface ScreenSessions {
  heading?: string;
  create?: string;
  join?: string;
  createPlaceholder?: string;
}

export interface ScreenUpgradeAccountSuccess {
  header?: string;
  text?: string;
}

export interface ScreenUpgradeAccountErrors {
  verificationNotFound?: string;
  verificationDeclined?: string;
  verificationAlreadyClaimed?: string;
  verificationFailed?: string;
}

export interface ScreenUpgradeAccount {
  enterCode?: string;
  activateButton?: string;
  haveCodeButton?: string;
  requestComplete?: string;
  needToUpgrade?: string;
  success: ScreenUpgradeAccountSuccess;
  errors: ScreenUpgradeAccountErrors;
  text?: string;
  requestCodeButton?: string;
  button?: string;
  password?: string;
  email?: string;
}
