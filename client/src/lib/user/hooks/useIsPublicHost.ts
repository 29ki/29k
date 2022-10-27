import {useState, useCallback, useEffect} from 'react';
import {useRecoilValue} from 'recoil';
import {ROLES} from '../../../../../shared/src/types/User';
import {userAtom} from '../state/state';

const useIsPublicHost = () => {
  const [isPublicHost, setIsPublicHost] = useState(false);
  const user = useRecoilValue(userAtom);

  const checkPublicHostRole = useCallback(
    async (forceRefresh?: boolean) => {
      const customClaim = await user?.getIdTokenResult(forceRefresh);
      setIsPublicHost(customClaim?.claims.role === ROLES.publicHost);
    },
    [user],
  );

  const updateIsPublicHost = useCallback(async () => {
    checkPublicHostRole(true);
  }, [checkPublicHostRole]);

  useEffect(() => {
    checkPublicHostRole();
  }, [checkPublicHostRole]);

  return {isPublicHost, updateIsPublicHost};
};

export default useIsPublicHost;
