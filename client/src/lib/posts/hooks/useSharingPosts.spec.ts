import {renderHook, act} from '@testing-library/react-hooks';
import {PostType} from '../../../../../shared/src/schemas/Post';
import {fetchPosts} from '../api/posts';
import useSharingPosts from './useSharingPosts';

jest.mock('../api/posts');

const mockFetchPosts = jest.mocked(fetchPosts);

const mockGetExerciseById = jest.fn().mockReturnValue({id: 'some-exercise-id'});
jest.mock(
  '../../content/hooks/useGetExerciseById',
  () => () => mockGetExerciseById,
);

afterEach(() => {
  jest.clearAllMocks();
});

describe('useSharingPosts', () => {
  describe('getSharingPosts', () => {
    it('should return fetched posts as PostItems', async () => {
      mockFetchPosts.mockResolvedValueOnce([
        {
          id: 'some-post-id',
        } as PostType,
        {
          id: 'some-other-post-id',
        } as PostType,
      ]);
      const {result} = renderHook(() => useSharingPosts());

      await act(async () => {
        await result.current.fetchSharingPosts();
      });

      expect(result.current.sharingPosts).toEqual([
        {
          type: 'text',
          item: {
            id: 'some-post-id',
          },
        },
        {
          type: 'text',
          item: {
            id: 'some-other-post-id',
          },
        },
      ]);
      expect(mockFetchPosts).toHaveBeenCalledTimes(1);
      expect(mockFetchPosts).toHaveBeenCalledWith(20);
    });

    it('should only return posts from exercises that are available', async () => {
      mockFetchPosts.mockResolvedValueOnce([
        {
          id: 'some-post-id',
          exerciseId: 'some-exercise-id',
        } as PostType,
        {
          id: 'some-post-id',
          exerciseId: 'some-unavailable-exercise-id',
        } as PostType,
      ]);
      mockGetExerciseById
        .mockReturnValueOnce({id: 'some-exercise-id'})
        .mockReturnValueOnce(null);
      const {result} = renderHook(() => useSharingPosts());

      await act(async () => {
        await result.current.fetchSharingPosts();
      });

      expect(result.current.sharingPosts).toEqual([
        {
          type: 'text',
          item: {
            id: 'some-post-id',
            exerciseId: 'some-exercise-id',
          },
        },
      ]);
      expect(mockFetchPosts).toHaveBeenCalledTimes(1);
      expect(mockFetchPosts).toHaveBeenCalledWith(20);

      expect(mockGetExerciseById).toHaveBeenCalledTimes(2);
      expect(mockGetExerciseById).toHaveBeenCalledWith('some-exercise-id');
      expect(mockGetExerciseById).toHaveBeenCalledWith(
        'some-unavailable-exercise-id',
      );
    });
  });
});
