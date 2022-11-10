import useUser from '../../../lib/user/hooks/useUser';
import useSessionState from '../state/state';

const useIsSessionHost = () => {
  const session = useSessionState(state => state.session);
  const user = useUser();

  return session?.hostId === user?.uid;
};

export default useIsSessionHost;
