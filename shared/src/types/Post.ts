import type {Timestamp} from 'firebase-admin/firestore';
import {LANGUAGE_TAG} from '../constants/i18n';
import {UserProfile} from './User';

export type PostFields = {
  id: string;
  exerciseId: string;
  userId: string | null;
  language: LANGUAGE_TAG;
  approved: boolean;
  text: string;
};

export type Post = PostFields & {
  createdAt: string;
  updatedAt: string;
  userProfile?: UserProfile;
};

export type PostData = PostFields & {
  createdAt: Timestamp;
  updatedAt: Timestamp;
};

export type PostParams = Omit<PostFields, 'id' | 'userId' | 'approved'> & {
  public?: boolean;
};

export type PostUpdateParams = {text?: string; public?: boolean};
