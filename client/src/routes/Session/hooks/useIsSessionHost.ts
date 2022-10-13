import {useRecoilValue} from 'recoil';
import {userAtom} from '../../../lib/user/state/state';
import {sessionAtom} from '../state/state';

const useIsSessionFacilitator = () => {
  const session = useRecoilValue(sessionAtom);
  const user = useRecoilValue(userAtom);

  return session?.facilitator === user?.uid;
};

export default useIsSessionFacilitator;
