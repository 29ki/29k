import {renderHook} from '@testing-library/react-hooks';
import {act} from 'react-test-renderer';
import useGetExercisesByTags from './useGetExercisesByTags';

jest.mock('./useExercises', () => () => [
  {
    id: 'exercise-id-1',
    name: 'exercise-1',
    tags: [{tag: 'tag-1'}, {tag: 'tag-2'}, {tag: 'tag-3'}],
  },
  {id: 'exercise-id-2', name: 'exercise-2', tags: [{tag: 'tag-2'}]},
  {id: 'exercise-id-3', name: 'exercise-3', tags: [{tag: 'tag-3'}]},
  {
    id: 'exercise-id-4',
    name: 'exercise-4',
    tags: [{tag: 'tag-1'}, {tag: 'tag-4'}],
    hidden: true,
  },
]);

afterEach(() => {
  jest.clearAllMocks();
});

describe('useGetExercisesByTags', () => {
  it('return exercises containing tags', () => {
    const {result} = renderHook(() =>
      useGetExercisesByTags([
        {id: 'tag-1', tag: 'tag-1'},
        {id: 'tag-2', tag: 'tag-2'},
      ]),
    );

    act(() => {
      expect(result.current).toEqual([
        {
          id: 'exercise-id-1',
          name: 'exercise-1',
          tags: [{tag: 'tag-1'}, {tag: 'tag-2'}, {tag: 'tag-3'}],
        },
        {id: 'exercise-id-2', name: 'exercise-2', tags: [{tag: 'tag-2'}]},
      ]);
    });
  });

  it('excludes exercise id', () => {
    const {result} = renderHook(() =>
      useGetExercisesByTags(
        [
          {id: 'tag-1', tag: 'tag-1'},
          {id: 'tag-2', tag: 'tag-2'},
          {id: 'tag-3', tag: 'tag-3'},
        ],
        'exercise-id-2',
      ),
    );

    act(() => {
      expect(result.current).toEqual([
        {
          id: 'exercise-id-1',
          name: 'exercise-1',
          tags: [{tag: 'tag-1'}, {tag: 'tag-2'}, {tag: 'tag-3'}],
        },
        {id: 'exercise-id-3', name: 'exercise-3', tags: [{tag: 'tag-3'}]},
      ]);
    });
  });
});
