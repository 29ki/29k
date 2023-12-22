/*
  At the time of writing there are two ways of tracking health data on Android:
  - Google Fit
  - Android Health Connect

  Google Fit support meditation minutes, but seems to be the deprecated way of tracking health data.
  It also have an annoying state bug in `react-native-google-fit` that makes it cumbersome to implement:
  https://github.com/StasDoskalenko/react-native-google-fit/issues/288

  Android Health Connect is the new way of tracking health data, but does not support meditation minutes.
  https://issuetracker.google.com/u/1/issues/294890773
  https://developer.android.com/reference/androidx/health/connect/client/records/ExerciseSessionRecord#summary

  Might be worth revisiting in the future.
 */
export const isAvailable = async () => false;

export const requestAuthorization = async () => false;

export const getAuthorizationStatus = async () => false;

export const log = async (start: Date, end?: Date) => {
  // Stupid hack to not get the "unused variable" warning
  start;
  end;
  return false;
};
