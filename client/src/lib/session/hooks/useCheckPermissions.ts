import {useCallback} from 'react';
import {Alert, Platform} from 'react-native';
import {useTranslation} from 'react-i18next';
import useRestartApp from '../../codePush/hooks/useRestartApp';
import {
  PERMISSIONS,
  RESULTS,
  checkMultiple,
  openSettings,
} from 'react-native-permissions';

const CAMERA_PERMISSION = Platform.select({
  ios: PERMISSIONS.IOS.CAMERA,
  default: PERMISSIONS.ANDROID.CAMERA,
});
const MICROPHONE_PERMISSION = Platform.select({
  ios: PERMISSIONS.IOS.MICROPHONE,
  default: PERMISSIONS.ANDROID.RECORD_AUDIO,
});

type Confirm = (
  keyPrefix: 'join' | 'camera' | 'microphone',
  onDismiss?: () => void,
) => Promise<void>;

type CheckAndPromptPermissions = (
  onGranted: () => void,
  onDismiss?: () => void,
) => void;

const useCheckPermissions = () => {
  const {t} = useTranslation('Component.CheckPermissions');
  const restartApp = useRestartApp();

  const openSettingsAndRestart = useCallback(async () => {
    await openSettings();
    // Restart JS-bundle to let permissions come into effect - on Android, iOS already does this.
    restartApp();
  }, [restartApp]);

  const confirm = useCallback<Confirm>(
    (keyPrefix, onDismiss = () => {}) =>
      new Promise(resolve => {
        Alert.alert(t(`${keyPrefix}.title`), t(`${keyPrefix}.message`), [
          {
            text: t(`${keyPrefix}.dismiss`),
            onPress: async () => {
              await onDismiss();
              resolve();
            },
          },
          {
            style: 'cancel',
            text: t(`${keyPrefix}.confirm`),
            onPress: async () => {
              await openSettingsAndRestart();
              resolve();
            },
          },
        ]);
      }),
    [t, openSettingsAndRestart],
  );

  const checkPermissions = useCallback(
    async (checks = [CAMERA_PERMISSION, MICROPHONE_PERMISSION]) =>
      Object.values(await checkMultiple(checks)).every(
        permission => permission === RESULTS.GRANTED,
      ),
    [],
  );

  const checkAndPromptJoinPermissions = useCallback<CheckAndPromptPermissions>(
    async (onGranted, onDismiss) => {
      if (await checkPermissions()) {
        await onGranted();
      } else {
        await confirm('join', onDismiss ?? onGranted);
      }
    },
    [confirm, checkPermissions],
  );

  const checkAndPromptCameraPermissions =
    useCallback<CheckAndPromptPermissions>(
      async (onGranted, onDismiss = () => {}) => {
        if (await checkPermissions([CAMERA_PERMISSION])) {
          await onGranted();
        } else {
          await confirm('camera', onDismiss);
        }
      },
      [confirm, checkPermissions],
    );

  const checkAndPromptMicrophonePermissions =
    useCallback<CheckAndPromptPermissions>(
      async (onGranted, onDismiss = () => {}) => {
        if (await checkPermissions([MICROPHONE_PERMISSION])) {
          await onGranted();
        } else {
          await confirm('microphone', onDismiss);
        }
      },
      [confirm, checkPermissions],
    );

  return {
    checkPermissions,
    checkAndPromptJoinPermissions,
    checkAndPromptCameraPermissions,
    checkAndPromptMicrophonePermissions,
  };
};

export default useCheckPermissions;
