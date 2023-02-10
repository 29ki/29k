import {DocumentData} from 'firebase-admin/firestore';

interface RetrivableData {
  id: string;
  data(): DocumentData | undefined;
}

export const getData = <T>(document: RetrivableData) => {
  const data = document.data();
  return {...data, id: document.id} as T;
};
