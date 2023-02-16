import useUserState, {
  getCurrentUserStateSelector,
} from '../../../../user/state/state';
import {generateId} from '../../../../utils/id';

const getMetricsUid = () => {
  const state = useUserState.getState();
  const {user, setCurrentUserState} = state;

  if (user) {
    const uid = getCurrentUserStateSelector(state)?.metricsUid;

    if (uid) {
      return uid;
    }

    const newUid = generateId();

    setCurrentUserState({metricsUid: newUid});

    return newUid;
  }
};

export default getMetricsUid;
