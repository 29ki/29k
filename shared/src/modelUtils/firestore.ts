import {DocumentData} from 'firebase-admin/firestore';

interface RetrivableData {
  data(): DocumentData | undefined;
}

export const getData = <T>(document: RetrivableData) => {
  const data = document.data();
  return data as T;
};
