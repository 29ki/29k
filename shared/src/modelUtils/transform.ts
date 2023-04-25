import {Timestamp} from 'firebase-admin/firestore';
import * as yup from 'yup';

const toISOString = (t: Timestamp) => {
  console.log('transsromf', t.toDate().toISOString());

  return t.toDate().toISOString();
};
export const transformTimestamp = yup.mixed<string>().transform(toISOString);
