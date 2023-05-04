import {useMemo} from 'react';
import useGetCollectionById from './useGetCollectionById';

const useGetStartedCollection = () => {
  const getCollectionById = useGetCollectionById();
  const getStartedCollection = useMemo(() => {
    return getCollectionById('46f653cd-b77f-458d-a257-1b171591c08b');
  }, [getCollectionById]);

  return {getStartedCollection};
};

export default useGetStartedCollection;
