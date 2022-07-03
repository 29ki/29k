import {renderHook, act} from '@testing-library/react-hooks';
import codePush from 'react-native-code-push';

import useRestartApp from './useRestartApp';

test('useRestartApp', () => {
  const {result} = renderHook(() => useRestartApp());

  act(() => {
    result.current();
  });

  expect(codePush.restartApp).toHaveBeenCalledTimes(1);
});
