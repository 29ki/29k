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
}

export interface ComponentCrashErrorMessage {
  text__markdown?: string;
}

export interface ComponentCreateSessionModalSelectContent {
  title?: string;
}

export interface ComponentCreateSessionModalSetDateTime {
  title?: string;
  cta?: string;
}

export interface ComponentCreateSessionModal {
  selectContent: ComponentCreateSessionModalSelectContent;
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
}

export interface ComponentSessionReminder {
  title?: string;
}

export interface ComponentTabs {
  home?: string;
  profile?: string;
}

export interface ScreenChangingRoomPermissionsAlert {
  title?: string;
  message?: string;
  join?: string;
  openSettings?: string;
}

export interface ScreenChangingRoom {
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
  userId?: string;
  uiLib?: string;
  clearUpdate?: string;
  checkUpdate?: string;
  language?: string;
  signOut?: string;
  signIn?: string;
  signInAnonymously?: string;
  upgrade?: string;
  email?: string;
  password?: string;
  or?: string;
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
  createPlaceholder?: string;
}
