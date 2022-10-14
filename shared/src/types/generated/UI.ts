/* eslintdisable */
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
  dismissbutton?: string;
  restartbutton?: string;
}

export interface ComponentCodePushOverlay {
  downloading: ComponentCodePushOverlayDownloading;
  install: ComponentCodePushOverlayInstall;
}

export interface ComponentConfirmExitTempleButtons {
  cancel?: string;
  confirm?: string;
}

export interface ComponentConfirmExitTemple {
  header?: string;
  text?: string;
  buttons: ComponentConfirmExitTempleButtons;
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
  textmarkdown?: string;
}

export interface ComponentCreateTempleModalSelectContent {
  title?: string;
}

export interface ComponentCreateTempleModalSetDateTime {
  title?: string;
  cta?: string;
}

export interface ComponentCreateTempleModal {
  selectContent: ComponentCreateTempleModalSelectContent;
  setDateTime: ComponentCreateTempleModalSetDateTime;
}

export interface ComponentDateTimePicker {
  date?: string;
  time?: string;
  done?: string;
}

export interface ComponentSessionReminder {
  title?: string;
}

export interface ComponentTabs {
  home?: string;
  profile?: string;
}

export interface ComponentTempleCard {
  addToCalendar?: string;
  join?: string;
  starts?: string;
}

export interface ComponentTempleModalDeleteButtons {
  cancel?: string;
  confirm?: string;
}

export interface ComponentTempleModalDelete {
  header?: string;
  text?: string;
  buttons: ComponentTempleModalDeleteButtons;
}

export interface ComponentTempleModal {
  edit?: string;
  done?: string;
  deleteButton?: string;
  delete: ComponentTempleModalDelete;
  addToCalendar?: string;
  addReminder?: string;
}

export interface ScreenChangingRoomPermissionsAlert {
  title?: string;
  message?: string;
  join?: string;
  openSettings?: string;
}

export interface ScreenChangingRoom {
  joinbutton?: string;
  cameraOff?: string;
  permissionsAlert: ScreenChangingRoomPermissionsAlert;
}

export interface ScreenHome {
  heading?: string;
  button?: string;
}

export interface ScreenKillSwitchUpdateAndroid {
  textmarkdown?: string;
  link?: string;
  button?: string;
}

export interface ScreenKillSwitchUpdateIos {
  textmarkdown?: string;
  link?: string;
  button?: string;
}

export interface ScreenKillSwitchUpdate {
  imageimage?: string;
  android: ScreenKillSwitchUpdateAndroid;
  ios: ScreenKillSwitchUpdateIos;
}

export interface ScreenKillSwitchMaintenance {
  imageimage?: string;
  textmarkdown?: string;
}

export interface ScreenKillSwitchFailed {
  imageimage?: string;
  textmarkdown?: string;
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

export interface ScreenTempleControls {
  start?: string;
  next?: string;
  prev?: string;
}

export interface ScreenTemple {
  nameSuffix?: string;
  endButton?: string;
  controls: ScreenTempleControls;
}

export interface ScreenTemples {
  heading?: string;
  create?: string;
  createPlaceholder?: string;
}
