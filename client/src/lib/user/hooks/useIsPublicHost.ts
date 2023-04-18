import {ROLE} from '../../../../../shared/src/types/User';
import useUserClaims from './useUserClaims';

const useIsPublicHost = () => {
  const {claims} = useUserClaims();

  return claims.role === ROLE.publicHost;
};

export default useIsPublicHost;
