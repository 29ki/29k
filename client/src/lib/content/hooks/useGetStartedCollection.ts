import {useMemo} from 'react';
import useGetCollectionById from './useGetCollectionById';
import {GET_STARTED_COLLECTION_ID} from '../constants';

const useGetStartedCollection = () => {
  const getCollectionById = useGetCollectionById();
  const getStartedCollection = useMemo(() => {
    return getCollectionById(GET_STARTED_COLLECTION_ID);
  }, [getCollectionById]);

  return {getStartedCollection};
};

export default useGetStartedCollection;
