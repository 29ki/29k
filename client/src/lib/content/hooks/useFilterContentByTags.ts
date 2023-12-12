import {useMemo} from 'react';
import {Collection} from '../../../../../shared/src/types/generated/Collection';
import {Exercise} from '../../../../../shared/src/types/generated/Exercise';
import {intersection} from 'ramda';

const useFilterContentByTags = <T extends Collection | Exercise>(
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
