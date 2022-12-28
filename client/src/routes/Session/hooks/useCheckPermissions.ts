import {useCallback, useContext} from 'react';
import {Alert, Linking} from 'react-native';
import {useTranslation} from 'react-i18next';
import useRestartApp from '../../../lib/codePush/hooks/useRestartApp';
import {DailyContext} from '../../../lib/daily/DailyProvider';

type Confirm = (
  keyPrefix: 'join' | 'camera' | 'microphone',
  onDismiss?: () => void,
) => void;

type CheckPermissions = (onGranted: () => void, onDismiss?: () => void) => void;

const useCheckPermissions = () => {
  const {t} = useTranslation('Component.CheckPermissions');
  const restartApp = useRestartApp();
  const {hasCameraPermissions, hasMicrophonePermissions} =
    useContext(DailyContext);

  const openSettings = useCallback(async () => {
    await Linking.openSettings();
    // Restart JS-bundle to let permissions come into effect - on Android, iOS already does this.
    restartApp();
  }, [restartApp]);

  const confirm = useCallback<Confirm>(
    (keyPrefix, onDismiss = () => {}) => {
      Alert.alert(t(`${keyPrefix}.title`), t(`${keyPrefix}.message`), [
        {
          text: t(`${keyPrefix}.dismiss`),
          onPress: onDismiss,
        },
        {
          style: 'cancel',
          text: t(`${keyPrefix}.confirm`),
          onPress: openSettings,
        },
      ]);
    },
    [t, openSettings],
  );

  const checkJoinPermissions = useCallback<CheckPermissions>(
    (onGranted, onDismiss) => {
      if (hasCameraPermissions() && hasMicrophonePermissions()) {
        onGranted();
      } else {
        confirm('join', onDismiss ?? onGranted);
      }
    },
    [hasCameraPermissions, hasMicrophonePermissions, confirm],
  );

  const checkCameraPermissions = useCallback<CheckPermissions>(
    (onGranted, onDismiss = () => {}) => {
      if (hasCameraPermissions()) {
        onGranted();
      } else {
        confirm('camera', onDismiss);
      }
    },
    [hasCameraPermissions, confirm],
  );

  const checkMicrophonePermissions = useCallback<CheckPermissions>(
    (onGranted, onDismiss = () => {}) => {
      if (hasMicrophonePermissions()) {
        onGranted();
      } else {
        confirm('camera', onDismiss);
      }
    },
    [hasMicrophonePermissions, confirm],
  );

  return {
    checkJoinPermissions,
    checkCameraPermissions,
    checkMicrophonePermissions,
  };
};

export default useCheckPermissions;
