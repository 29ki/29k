import {renderHook, act} from '@testing-library/react-hooks';
import codePush from 'react-native-code-push';

import useClearUpdates from './useClearUpdates';

test('useClearUpdates', () => {
  const {result} = renderHook(() => useClearUpdates());

  act(() => {
    result.current();
  });

  expect(codePush.clearUpdates).toHaveBeenCalledTimes(1);
});
