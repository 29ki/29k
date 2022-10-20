import {pickBy} from 'ramda';
import {randomInt} from 'node:crypto';
import {DocumentData, DocumentSnapshot} from 'firebase-admin/firestore';

export const removeEmpty = <T extends object>(obj: T) =>
  pickBy(value => value !== undefined, obj) as T;

export const getData = <T>(document: DocumentSnapshot<DocumentData>) => {
  const data = document.data();
  return data as T;
};

export const generateVerificationCode = () => randomInt(100_000, 999_999);
