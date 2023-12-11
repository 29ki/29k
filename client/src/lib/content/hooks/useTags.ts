import {useMemo} from 'react';
import useGetTagById from './useGetTagById';
import {Tag} from '../../../../../shared/src/types/generated/Tag';
import {isNotNil} from 'ramda';
import useTagIds from './useTagIds';

const sortByOrder = (a: Tag, b: Tag) =>
  typeof a.sortOrder === 'number' && typeof b.sortOrder === 'number'
    ? a.sortOrder < b.sortOrder
      ? -1
      : 1
    : typeof a?.sortOrder === 'number'
      ? -1
      : 0;

const sortByName = (a: Tag, b: Tag) =>
  a.name < b.name ? -1 : a.name > b.name ? 1 : 0;

const useTags = (tagIds?: Array<string>) => {
  const allIds = useTagIds();
  const getTagById = useGetTagById();

  const ids = tagIds ?? allIds;

  return useMemo(
    () =>
      ids
        .map(id => getTagById(id))
        .filter(isNotNil)
        .sort(sortByName)
        .sort(sortByOrder),
    [ids, getTagById],
  );
};

export default useTags;
