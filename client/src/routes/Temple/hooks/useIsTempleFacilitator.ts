import {useRecoilValue} from 'recoil';
import {userAtom} from '../../../lib/user/state/state';
import {templeAtom} from '../state/state';

const useIsTempleFacilitator = () => {
  const temple = useRecoilValue(templeAtom);
  const user = useRecoilValue(userAtom);

  return temple?.facilitator === user?.uid;
};

export default useIsTempleFacilitator;
