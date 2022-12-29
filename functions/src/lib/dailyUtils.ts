import dayjs from 'dayjs';
import jwt from 'jsonwebtoken';
import {getDomainId} from './dailyApi';
import config from './config';

const {DAILY_API_KEY} = config;

export const generateSessionToken = async (
  roomName: string,
  isHost: boolean,
  expireDate: dayjs.Dayjs,
): Promise<string> => {
  const domainId = await getDomainId();

  const payload = {
    r: roomName,
    d: domainId,
    iat: dayjs().unix(),
    exp: expireDate.unix(),
    o: isHost,
  };
  return jwt.sign(payload, DAILY_API_KEY);
};
