import {renderHook} from '@testing-library/react-hooks';
import useExercisesByTags from './useExercisesByTags';

jest.mock('./useExercises', () => () => [
  {
    id: 'exercise-id-1',
    name: 'exercise-1',
    tags: [{tag: 'tag-1'}, {tag: 'tag-2'}, {tag: 'tag-3'}],
  },
  {id: 'exercise-id-2', name: 'exercise-2', tags: [{tag: 'tag-2'}]},
  {id: 'exercise-id-3', name: 'exercise-3', tags: [{tag: 'tag-3'}]},
]);

afterEach(() => {
  jest.clearAllMocks();
});

describe('useExercisesByTags', () => {
  it('return exercises containing tags', () => {
    const {result} = renderHook(() =>
      useExercisesByTags([
        {id: 'tag-1', tag: 'tag-1'},
        {id: 'tag-2', tag: 'tag-2'},
      ]),
    );

    expect(result.current).toEqual([
      {
        id: 'exercise-id-1',
        name: 'exercise-1',
        tags: [{tag: 'tag-1'}, {tag: 'tag-2'}, {tag: 'tag-3'}],
      },
      {id: 'exercise-id-2', name: 'exercise-2', tags: [{tag: 'tag-2'}]},
    ]);
  });

  it('excludes exercise id', () => {
    const {result} = renderHook(() =>
      useExercisesByTags(
        [
          {id: 'tag-1', tag: 'tag-1'},
          {id: 'tag-2', tag: 'tag-2'},
          {id: 'tag-3', tag: 'tag-3'},
        ],
        'exercise-id-2',
      ),
    );

    expect(result.current).toEqual([
      {
        id: 'exercise-id-1',
        name: 'exercise-1',
        tags: [{tag: 'tag-1'}, {tag: 'tag-2'}, {tag: 'tag-3'}],
      },
      {id: 'exercise-id-3', name: 'exercise-3', tags: [{tag: 'tag-3'}]},
    ]);
  });

  it('limits the result', () => {
    const {result} = renderHook(() =>
      useExercisesByTags(
        [
          {id: 'tag-1', tag: 'tag-1'},
          {id: 'tag-2', tag: 'tag-2'},
          {id: 'tag-3', tag: 'tag-3'},
        ],
        undefined,
        2,
      ),
    );

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
