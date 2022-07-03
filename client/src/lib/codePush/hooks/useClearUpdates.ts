import {useCallback} from 'react';
import codePush from 'react-native-code-push';

const useClearUpdates = () => useCallback(() => codePush.clearUpdates(), []);

export default useClearUpdates;
