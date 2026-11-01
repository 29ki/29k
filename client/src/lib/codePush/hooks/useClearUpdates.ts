import {useCallback} from 'react';
import codePush from '@revopush/react-native-code-push';

const useClearUpdates = () => useCallback(() => codePush.clearUpdates(), []);

export default useClearUpdates;
