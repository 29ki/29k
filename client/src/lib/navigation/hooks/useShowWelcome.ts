import {useEffect} from 'react';
import auth from '@react-native-firebase/auth';
import useAppState from '../../appState/state/state';

export const useShowWelcome = () => {
  const setIsFirstLaunch = useAppState(state => state.setIsFirstLaunch);
  const {currentUser} = auth();

  useEffect(() => {
    if (!currentUser) {
      setIsFirstLaunch(true);
    }
  }, [currentUser, setIsFirstLaunch]);
};
