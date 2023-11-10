import {renderHook, act} from '@testing-library/react-hooks';
import {PostType} from '../../../../../shared/src/schemas/Post';
import {fetchPosts} from '../api/posts';
import useSharingPosts from './useSharingPosts';

jest.mock('../api/posts');

const mockFetchPosts = jest.mocked(fetchPosts);

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
      ]);
      const {result} = renderHook(() => useSharingPosts());

      await act(async () => {
        await result.current.fetchSharingPosts();

        expect(result.current.sharingPosts).toEqual([
          {
            type: 'text',
            item: {
              id: 'some-post-id',
            },
          },
        ]);
        expect(mockFetchPosts).toHaveBeenCalledTimes(1);
        expect(mockFetchPosts).toHaveBeenCalledWith(20);
      });
    });
  });
});
