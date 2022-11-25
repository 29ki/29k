import {pickBy} from 'ramda';
import {randomInt} from 'node:crypto';

export const removeEmpty = <T extends object>(obj: T) =>
  pickBy(value => value !== undefined, obj) as T;

export const generateVerificationCode = () => randomInt(100_000, 999_999);
