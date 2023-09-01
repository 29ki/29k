import {equals} from 'ramda';
import {useStoreWithEqualityFn} from 'zustand/traditional';
import userState from '../state/state';

const useUser = () =>
  useStoreWithEqualityFn(userState, state => state.user, equals);

export default useUser;
