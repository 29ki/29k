import type {Timestamp} from 'firebase-admin/firestore';
import {LANGUAGE_TAG} from '../constants/i18n';
import {UserProfile} from './User';

export type PostFields = {
  id: string;
  exerciseId: string;
  userId?: string;
  language: LANGUAGE_TAG;
  public: boolean;
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
