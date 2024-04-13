import {renderHook} from '@testing-library/react-hooks';
import useFilterContentByTags from './useFilterContentByTags';
import {ExerciseWithLanguage} from '../types';

afterEach(() => {
  jest.clearAllMocks();
});

describe('useFilterContentByTags', () => {
  it('return content containing tags', () => {
    const {result} = renderHook(() =>
      useFilterContentByTags(
        [
          {
            id: 'content-id-1',
            tags: ['tag-1', 'tag-2', 'tag-3'],
          },
          {id: 'content-id-2', tags: ['tag-2']},
          {id: 'content-id-3', tags: ['tag-3']},
        ] as ExerciseWithLanguage[],
        ['tag-1', 'tag-2'],
      ),
    );

    expect(result.current).toEqual([
      {
        id: 'content-id-1',
        tags: ['tag-1', 'tag-2', 'tag-3'],
      },
      {id: 'content-id-2', tags: ['tag-2']},
    ]);
  });

  it('does not filter when tags are empty', () => {
    const {result} = renderHook(() =>
      useFilterContentByTags([
        {
          id: 'content-id-1',
          tags: ['tag-1', 'tag-2', 'tag-3'],
        },
        {id: 'content-id-2', tags: ['tag-2']},
        {id: 'content-id-3', tags: ['tag-3']},
      ] as ExerciseWithLanguage[]),
    );

    expect(result.current).toEqual([
      {
        id: 'content-id-1',
        tags: ['tag-1', 'tag-2', 'tag-3'],
      },
      {id: 'content-id-2', tags: ['tag-2']},
      {id: 'content-id-3', tags: ['tag-3']},
    ]);
  });

  it('excludes content id', () => {
    const {result} = renderHook(() =>
      useFilterContentByTags(
        [
          {
            id: 'content-id-1',
            tags: ['tag-1', 'tag-2', 'tag-3'],
          },
          {id: 'content-id-2', tags: ['tag-2']},
          {id: 'content-id-3', tags: ['tag-3']},
        ] as ExerciseWithLanguage[],
        ['tag-1', 'tag-2', 'tag-3'],
        'content-id-2',
      ),
    );

    expect(result.current).toEqual([
      {
        id: 'content-id-1',
        tags: ['tag-1', 'tag-2', 'tag-3'],
      },
      {id: 'content-id-3', tags: ['tag-3']},
    ]);
  });

  it('limits the result', () => {
    const {result} = renderHook(() =>
      useFilterContentByTags(
        [
          {
            id: 'content-id-1',
            tags: ['tag-1', 'tag-2', 'tag-3'],
          },
          {id: 'content-id-2', tags: ['tag-2']},
          {id: 'content-id-3', tags: ['tag-3']},
        ] as ExerciseWithLanguage[],
        ['tag-1', 'tag-2', 'tag-3'],
        undefined,
        2,
      ),
    );

    expect(result.current).toEqual([
      {
        id: 'content-id-1',
        tags: ['tag-1', 'tag-2', 'tag-3'],
      },
      {id: 'content-id-2', tags: ['tag-2']},
    ]);
  });
});
