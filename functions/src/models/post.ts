import 'firebase-functions';
import {firestore} from 'firebase-admin';
import {Timestamp} from 'firebase-admin/firestore';
import {getData} from '../../../shared/src/modelUtils/firestore';
import {PostData, PostFields, Post} from '../../../shared/src/types/Post';
import {getPost} from '../../../shared/src/modelUtils/post';
import {SHARING_POST_MIN_LENGTH} from '../lib/constants/post';

const POSTS_COLLECTION = 'posts';

const keepSufficientSharingPostLength = (
  snapshot: firestore.QueryDocumentSnapshot<firestore.DocumentData>,
) => snapshot.data().text.length >= SHARING_POST_MIN_LENGTH;

export const getPostById = async (
  id: PostData['id'],
): Promise<Post | undefined> => {
  const postDoc = await firestore().collection(POSTS_COLLECTION).doc(id).get();

  if (!postDoc.exists) {
    return;
  }

  return getPost(getData<PostData>(postDoc));
};

export const getPostsByExerciseAndSharingId = async (
  exerciseId: string,
  sharingId: string,
  limit: number,
): Promise<Post[]> => {
  const snapshot = await firestore()
    .collection(POSTS_COLLECTION)
    .where('exerciseId', '==', exerciseId)
    .where('sharingId', '==', sharingId)
    .where('approved', '==', true)
    .orderBy('createdAt', 'desc')
    .limit(limit * 2) // We need overfetching to be able to skip posts with insufficient text length
    .get();

  return snapshot.docs
    .filter(keepSufficientSharingPostLength)
    .slice(0, limit) // Respect desired limit if we got too many
    .map(doc => getPost(getData<PostData>(doc)));
};

export const addPost = async (post: Omit<PostFields, 'id'>): Promise<Post> => {
  const now = Timestamp.now();
  const postDoc = await firestore()
    .collection(POSTS_COLLECTION)
    .add({...post, createdAt: now, updatedAt: now});

  return getPost(getData<PostData>(await postDoc.get()));
};

export const updatePost = async (
  id: string,
  post: Partial<Omit<PostFields, 'id'>>,
) => {
  const now = Timestamp.now();
  await firestore()
    .collection(POSTS_COLLECTION)
    .doc(id)
    .update({...post, updatedAt: now});
};

export const deletePost = async (id: string) => {
  await firestore().collection(POSTS_COLLECTION).doc(id).delete();
};
