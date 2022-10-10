import {pickBy} from 'ramda';

export const removeEmpty = <T extends object>(obj: T) =>
  pickBy(value => value !== undefined, obj) as T;
