import 'firebase-functions';
import {firestore} from 'firebase-admin';
import {FieldValue, Timestamp} from 'firebase-admin/firestore';
import {getData} from '../../../shared/src/modelUtils/firestore';
import {SHARING_POST_MIN_LENGTH} from '../lib/constants/post';
import {PostInput, PostRecord} from './types/types';
import {DEFAULT_LANGUAGE_TAG, LANGUAGE_TAG} from '../lib/i18n';

const POSTS_COLLECTION = 'posts';

const keepSufficientSharingPostLength = (
  snapshot: firestore.QueryDocumentSnapshot<firestore.DocumentData>,
) => snapshot.data().text.length >= SHARING_POST_MIN_LENGTH;

export const getPostById = async (
  id: PostRecord['id'],
): Promise<PostRecord | undefined> => {
  const postDoc = await firestore().collection(POSTS_COLLECTION).doc(id).get();

  if (!postDoc.exists) {
    return;
  }

  return getData<PostRecord>(postDoc);
};

export const getPosts = async (
  limit: number,
  languages: LANGUAGE_TAG[] = [DEFAULT_LANGUAGE_TAG],
  exerciseId?: string,
  sharingId?: string,
): Promise<PostRecord[]> => {
  let query = firestore()
    .collection(POSTS_COLLECTION)
    .where('approved', '==', true)
    .where('language', 'in', languages);

  if (exerciseId) {
    query = query.where('exerciseId', '==', exerciseId);
  }

  if (exerciseId) {
    query = query.where('sharingId', '==', sharingId);
  }

  const snapshot = await query
    .orderBy('createdAt', 'desc')
    .limit(limit * 2) // We need overfetching to be able to skip posts with insufficient text length
    .get();

  return snapshot.docs
    .filter(keepSufficientSharingPostLength)
    .slice(0, limit) // Respect desired limit if we got too many
    .map(doc => getData<PostRecord>(doc));
};

export const addPost = async (post: PostInput): Promise<PostRecord> => {
  const now = Timestamp.now();
  const postDoc = await firestore()
    .collection(POSTS_COLLECTION)
    .add({...post, createdAt: now, updatedAt: now});

  return getData<PostRecord>(await postDoc.get());
};

export const updatePost = async (
  id: string,
  post: Partial<Omit<PostRecord, 'id'>>,
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

export const increasePostRelates = async (id: string) => {
  await updatePost(id, {relates: FieldValue.increment(1)});
};

export const decreasePostRelates = async (id: string) => {
  await updatePost(id, {relates: FieldValue.increment(-1)});
};
