import React, {useEffect} from 'react';
import {useSetRecoilState} from 'recoil';

import * as i18n from './lib/i18n';
import * as sentry from './lib/sentry';

import useResumeFromBackgrounded from './lib/appState/hooks/useResumeFromBackgrounded';
import {isColdStartedAtom} from './lib/appState/state/state';
import useCheckForUpdate from './lib/codePush/hooks/useCheckForUpdate';
import useKillSwitch from './lib/killSwitch/hooks/useKillSwitch';
import useAuthenticateUser from './lib/user/hooks/useAuthenticateUser';

i18n.init();
sentry.init();

const Bootstrap: React.FC<{children: React.ReactNode}> = ({children}) => {
  useAuthenticateUser();

  const setIsColdStarted = useSetRecoilState(isColdStartedAtom);
  const checkKillSwitch = useKillSwitch();
  const checkForUpdate = useCheckForUpdate();

  // Check killswitch and updates on mount
  useEffect(() => {
    checkKillSwitch();
    checkForUpdate();
  }, [checkKillSwitch, checkForUpdate]);

  // Check killswitch and updates when resuming from background
  useResumeFromBackgrounded(() => {
    setIsColdStarted(false);
    checkKillSwitch();
    checkForUpdate();
  });

  return <>{children}</>;
};

export default Bootstrap;
