import {useCallback} from 'react';
import codePush from 'react-native-code-push';

const useRestartApp = () => useCallback(() => codePush.restartApp(), []);

export default useRestartApp;
