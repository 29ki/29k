import {Timestamp} from 'firebase-admin/firestore';

export type RequestStatus = 'requested' | 'accepted' | 'declined' | 'verified';

export type RequestData = {
  verificationCode?: number;
  status: RequestStatus;
  createdAt?: Timestamp;
  updatedAt: Timestamp;
};
