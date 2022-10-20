import {useState, useCallback, useEffect} from 'react';
import {useRecoilValue} from 'recoil';
import {ROLES} from '../../../../../shared/src/types/User';
import {userAtom} from '../state/state';

const useIsPublicHost = () => {
  const [hasPublicHostRole, setHasPublicHostRole] = useState(false);
  const user = useRecoilValue(userAtom);

  const checkPublicHostRole = useCallback(async () => {
    const customClaim = await user?.getIdTokenResult(true);
    setHasPublicHostRole(customClaim?.claims.role === ROLES.publicHost);
  }, [user]);

  useEffect(() => {
    checkPublicHostRole();
  }, [checkPublicHostRole]);

  return hasPublicHostRole;
};

export default useIsPublicHost;
