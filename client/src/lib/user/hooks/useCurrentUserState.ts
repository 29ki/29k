import useUserState, {getCurrentUserStateSelector} from '../state/state';

const useCurrentUserState = () => useUserState(getCurrentUserStateSelector);

export default useCurrentUserState;
