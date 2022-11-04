import useUserState from '../state/state';

const useUser = () => useUserState(state => state.user);

export default useUser;
