import React from 'react';
import useUserState from './lib/user/state/state';
import useAppState from './lib/appState/state/state';

const RehydrateWrapper: React.FC<{children: React.ReactNode}> = ({
  children,
}) => {
  const isAppStateHydrated = useAppState(state => state.__hasHydrated);
  const isUserStateHydrated = useUserState(state => state.__hasHydrated);

  if (isAppStateHydrated && isUserStateHydrated) {
    return <>{children}</>;
  }

  return null;
};

export default RehydrateWrapper;
