import {renderHook, act} from '@testing-library/react-hooks';
import codePush from 'react-native-code-push';

import useCheckForUpdate from './useCheckForUpdate';

describe('useCheckForUpdate', () => {
  it('calls codePush.sync', () => {
    const {result} = renderHook(() => useCheckForUpdate());

    act(() => {
      result.current();
    });

    expect(codePush.sync).toHaveBeenCalledTimes(1);
    expect(codePush.sync).toHaveBeenCalledWith(
      {deploymentKey: '', mandatoryInstallMode: 1337},
      expect.any(Function),
      expect.any(Function),
    );
  });
});
