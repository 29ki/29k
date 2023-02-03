import React, {useEffect} from 'react';

import * as i18n from './lib/i18n';
import * as sentry from './lib/sentry';
import * as metrics from './lib/metrics';

import useResumeFromBackgrounded from './lib/appState/hooks/useResumeFromBackgrounded';
import useAppState from './lib/appState/state/state';
import useCheckForUpdate from './lib/codePush/hooks/useCheckForUpdate';
import useKillSwitch from './lib/killSwitch/hooks/useKillSwitch';
import useAuthenticateUser from './lib/user/hooks/useAuthenticateUser';
import {GIT_COMMIT_SHORT} from 'config';
import useUser from './lib/user/hooks/useUser';
import useIsPublicHost from './lib/user/hooks/useIsPublicHost';
import usePreferredLanguage from './lib/i18n/hooks/usePreferredLanguage';

i18n.init();
sentry.init();
metrics.init();

const Bootstrap: React.FC<{children: React.ReactNode}> = ({children}) => {
  useAuthenticateUser();
  usePreferredLanguage();

  const setIsColdStarted = useAppState(state => state.setIsColdStarted);
  const checkKillSwitch = useKillSwitch();
  const checkForUpdate = useCheckForUpdate();
  const user = useUser();
  const isPublicHost = useIsPublicHost();

  // Check killswitch and updates on mount
  useEffect(() => {
    checkKillSwitch();
    checkForUpdate();
    metrics.setCoreProperties({
      'App Git Commit': GIT_COMMIT_SHORT,
    });
  }, [checkKillSwitch, checkForUpdate]);

  // Check killswitch and updates when resuming from background
  useResumeFromBackgrounded(() => {
    setIsColdStarted(false);
    checkKillSwitch();
    checkForUpdate();
  });

  // Update metrics user properties on user changes
  useEffect(() => {
    if (user) {
      metrics.setUserProperties({
        Anonymous: user?.isAnonymous,
        'Public Host': isPublicHost,
      });
    }
  }, [user, isPublicHost]);

  return <>{children}</>;
};

export default Bootstrap;
