import {ROLES} from '../../../../../shared/src/types/User';
import useUserClaims from './useUserClaims';

const useIsPublicHost = () => {
  const {claims} = useUserClaims();

  return claims.role === ROLES.publicHost;
};

export default useIsPublicHost;
