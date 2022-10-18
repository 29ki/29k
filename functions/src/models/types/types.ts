import {Timestamp} from 'firebase-admin/firestore';

export type RequestData = {
  userId: string;
  verificationCode: number;
  expires: Timestamp;
};
