import {equals} from 'ramda';
import useUserState from '../state/state';

const useUser = () => useUserState(state => state.user, equals);

export default useUser;
