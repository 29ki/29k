import {useCallback, useContext} from 'react';
import {Alert, Linking} from 'react-native';
import {useTranslation} from 'react-i18next';
import useRestartApp from '../../codePush/hooks/useRestartApp';
import {DailyContext} from '../../daily/DailyProvider';

type Prompt = (
  keyPrefix: 'join' | 'camera' | 'microphone',
  onDismiss?: () => void,
) => Promise<void>;

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

  const prompt = useCallback<Prompt>(
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
              await openSettings();
              resolve();
            },
          },
        ]);
      }),
    [t, openSettings],
  );

  const checkAndPromptJoinPermissions = useCallback<CheckPermissions>(
    async (onGranted, onDismiss) => {
      if (hasCameraPermissions() && hasMicrophonePermissions()) {
        await onGranted();
      } else {
        await prompt('join', onDismiss ?? onGranted);
      }
    },
    [hasCameraPermissions, hasMicrophonePermissions, prompt],
  );

  const checkAndPromptCameraPermissions = useCallback<CheckPermissions>(
    async (onGranted, onDismiss = () => {}) => {
      if (hasCameraPermissions()) {
        await onGranted();
      } else {
        await prompt('camera', onDismiss);
      }
    },
    [hasCameraPermissions, prompt],
  );

  const checkAndPromptMicrophonePermissions = useCallback<CheckPermissions>(
    async (onGranted, onDismiss = () => {}) => {
      if (hasMicrophonePermissions()) {
        await onGranted();
      } else {
        await prompt('microphone', onDismiss);
      }
    },
    [hasMicrophonePermissions, prompt],
  );

  return {
    checkAndPromptJoinPermissions,
    checkAndPromptCameraPermissions,
    checkAndPromptMicrophonePermissions,
  };
};

export default useCheckPermissions;
