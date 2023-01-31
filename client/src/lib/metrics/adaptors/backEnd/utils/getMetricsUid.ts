import * as uuid from 'uuid';
import useUserState, {
  getCurrentUserStateSelector,
} from '../../../../user/state/state';

const getMetricsUid = async () => {
  const state = useUserState.getState();
  const {user, setCurrentUserState} = state;

  if (user) {
    const uid = getCurrentUserStateSelector(state)?.metricsUid;

    if (uid) {
      return uid;
    }

    const newUid = uuid.v4();

    setCurrentUserState({metricsUid: newUid});

    return newUid;
  }
};

export default getMetricsUid;
