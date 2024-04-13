import {useMemo} from 'react';
import {intersection} from 'ramda';
import {CollectionWithLanguage, ExerciseWithLanguage} from '../types';

const useFilterContentByTags = <
  T extends CollectionWithLanguage | ExerciseWithLanguage,
>(
  content: T[] = [],
  filterTags: string[] = [],
  excludeId?: string,
  limit?: number,
): T[] =>
  useMemo(() => {
    const filteredContent = content.filter(
      ({id, tags = []}) =>
        !filterTags.length ||
        (id !== excludeId && intersection(tags, filterTags).length > 0),
    );
    return limit ? filteredContent.slice(0, limit) : filteredContent;
  }, [filterTags, content, excludeId, limit]);

export default useFilterContentByTags;
