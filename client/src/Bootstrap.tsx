import React, {useEffect} from 'react';
import {useTranslation} from 'react-i18next';

import * as i18nLib from './lib/i18n';
import * as sentry from './lib/sentry';
import * as metrics from './lib/metrics';
import * as stripe from './lib/stripe';

import useResumeFromBackgrounded from './lib/appState/hooks/useResumeFromBackgrounded';
import useAppState from './lib/appState/state/state';
import useCheckForUpdate from './lib/codePush/hooks/useCheckForUpdate';
import useKillSwitch from './lib/killSwitch/hooks/useKillSwitch';
import useAuthenticateUser from './lib/user/hooks/useAuthenticateUser';
import {GIT_COMMIT_SHORT} from 'config';
import useUser from './lib/user/hooks/useUser';
import useIsPublicHost from './lib/user/hooks/useIsPublicHost';
import usePreferredLanguage from './lib/i18n/hooks/usePreferredLanguage';
import {LANGUAGE_TAG} from './lib/i18n';
import useNotificationsSetup from './lib/notifications/hooks/useNotificationsSetup';
import useUpdatePracticeReminders from './lib/reminders/hooks/useUpdatePracticeReminders';

i18nLib.init();
sentry.init();
metrics.init();
stripe.init();

// Since the i18 backend have not run properly before accessing
// content on the landing screen we need to make sure this has been done.
// By calling useTranslation the i18n backend will resolve the resources already in bootstrap.
// Since this inside suspence it will be loaded before continuting
const useInitHidableContent = () => {
  useTranslation('collections');
  useTranslation('exercises');
};

const Bootstrap: React.FC<{children: React.ReactNode}> = ({children}) => {
  useAuthenticateUser();
  usePreferredLanguage();
  useNotificationsSetup();

  const {i18n} = useTranslation();
  useInitHidableContent();

  const setIsColdStarted = useAppState(state => state.setIsColdStarted);
  const {updatePracticeNotifications} = useUpdatePracticeReminders();
  const checkKillSwitch = useKillSwitch();
  const checkForUpdate = useCheckForUpdate();
  const user = useUser();
  const isPublicHost = useIsPublicHost();

  // App start
  useEffect(() => {
    checkKillSwitch();
    checkForUpdate();
    metrics.setCoreProperties({
      'App Git Commit': GIT_COMMIT_SHORT,
    });
  }, [checkKillSwitch, checkForUpdate]);

  // Resuming from backgrounded
  useResumeFromBackgrounded(() => {
    setIsColdStarted(false);
    checkKillSwitch();
    checkForUpdate();
  });

  // Authenticated user changes
  useEffect(() => {
    if (user) {
      updatePracticeNotifications();
    }
  }, [user, updatePracticeNotifications]);

  // Authenticated user or language changes
  useEffect(() => {
    if (user) {
      metrics.setUserProperties({
        Anonymous: user?.isAnonymous,
        'Public Host': isPublicHost,
        Language: i18n.resolvedLanguage as LANGUAGE_TAG,
      });
    }
  }, [user, isPublicHost, i18n.resolvedLanguage]);

  return <>{children}</>;
};

export default Bootstrap;
