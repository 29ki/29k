import React, {useEffect} from 'react';
import codePush from 'react-native-code-push';

import useResumeFromBackgrounded from '../hooks/useResumeFromBackgrounded';
import {useSetRecoilState} from 'recoil';
import {isColdStartedAtom} from '../state/state';
import useCheckForUpdate from '../hooks/useCheckForUpdate';

const CodePush: React.FC = ({children}) => {
  const setIsColdStarted = useSetRecoilState(isColdStartedAtom);
  const checkForUpdate = useCheckForUpdate();

  // Check for update on mount
  useEffect(() => {
    checkForUpdate();
  }, [checkForUpdate]);

  // Check for updates when resuming from background
  useResumeFromBackgrounded(() => {
    setIsColdStarted(false);
    checkForUpdate();
  });

  return <>{children}</>;
};

export default codePush({
  checkFrequency: codePush.CheckFrequency.MANUAL,
})(CodePush);
