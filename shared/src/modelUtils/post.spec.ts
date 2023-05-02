import {Timestamp} from 'firebase-admin/firestore';
import {PostData} from '../schemas/Post';
import {getPost} from './post';

describe('post', () => {
  describe('getPost', () => {
    it('should transform post data firestore timestamps into dates', async () => {
      const someDate = new Date('2022-11-16');
      const postData = {
        id: 'some-post-id',
        createdAt: Timestamp.fromDate(someDate),
        updatedAt: Timestamp.fromDate(someDate),
      } as PostData;

      expect(getPost(postData)).toEqual({
        id: 'some-post-id',
        createdAt: '2022-11-16T00:00:00.000Z',
        updatedAt: '2022-11-16T00:00:00.000Z',
      });
    });
  });
});
