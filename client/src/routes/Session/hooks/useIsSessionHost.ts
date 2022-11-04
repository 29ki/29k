import {useRecoilValue} from 'recoil';
import useUser from '../../../lib/user/hooks/useUser';
import {sessionAtom} from '../state/state';

const useIsSessionHost = () => {
  const session = useRecoilValue(sessionAtom);
  const user = useUser();

  return session?.hostId === user?.uid;
};

export default useIsSessionHost;
