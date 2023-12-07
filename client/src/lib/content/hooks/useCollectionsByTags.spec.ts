import {renderHook} from '@testing-library/react-hooks';
import useCollectionsByTags from './useCollectionsByTags';

jest.mock('./useCollections', () => () => [
  {
    id: 'collection-id-1',
    name: 'collection-1',
    tags: ['tag-1', 'tag-2', 'tag-3'],
  },
  {id: 'collection-id-2', name: 'collection-2', tags: ['tag-2']},
  {id: 'collection-id-3', name: 'collection-3', tags: ['tag-3']},
]);

afterEach(() => {
  jest.clearAllMocks();
});

describe('useCollectionsByTags', () => {
  it('return collections containing tags', () => {
    const {result} = renderHook(() => useCollectionsByTags(['tag-1', 'tag-2']));

    expect(result.current).toEqual([
      {
        id: 'collection-id-1',
        name: 'collection-1',
        tags: ['tag-1', 'tag-2', 'tag-3'],
      },
      {id: 'collection-id-2', name: 'collection-2', tags: ['tag-2']},
    ]);
  });

  it('excludes collection id', () => {
    const {result} = renderHook(() =>
      useCollectionsByTags(['tag-1', 'tag-2', 'tag-3'], 'collection-id-2'),
    );

    expect(result.current).toEqual([
      {
        id: 'collection-id-1',
        name: 'collection-1',
        tags: ['tag-1', 'tag-2', 'tag-3'],
      },
      {id: 'collection-id-3', name: 'collection-3', tags: ['tag-3']},
    ]);
  });

  it('limits the result', () => {
    const {result} = renderHook(() =>
      useCollectionsByTags(['tag-1', 'tag-2', 'tag-3'], undefined, 2),
    );

    expect(result.current).toEqual([
      {
        id: 'collection-id-1',
        name: 'collection-1',
        tags: ['tag-1', 'tag-2', 'tag-3'],
      },
      {id: 'collection-id-2', name: 'collection-2', tags: ['tag-2']},
    ]);
  });
});
