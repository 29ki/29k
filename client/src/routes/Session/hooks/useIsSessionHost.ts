import {useRecoilValue} from 'recoil';
import {userAtom} from '../../../lib/user/state/state';
import {sessionAtom} from '../state/state';

const useIsSessionHost = () => {
  const session = useRecoilValue(sessionAtom);
  const user = useRecoilValue(userAtom);

  return session?.hostId === user?.uid;
};

export default useIsSessionHost;
