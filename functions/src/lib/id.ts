import {compose} from 'ramda';
import {v5 as uuidv5} from 'uuid';
import bs58 from 'bs58';

import config from './config';

const {DAILY_ID_SALT} = config;

const uuidv5Bytes = (name: string) => uuidv5(name, DAILY_ID_SALT, []);
const createId = compose(bs58.encode, uuidv5Bytes);

export const createRctUserId = (roomId: string, userId: string) =>
  createId(`room:${roomId}:user:${userId}`);
