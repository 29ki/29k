import {Timestamp} from 'firebase-admin/firestore';

export type RequestData = {
  verificationCode: number;
  expires: Timestamp;
  createdAt: Timestamp;
  updatedAt: Timestamp;
};
