import dayjs from 'dayjs';
import jwt from 'jsonwebtoken';
import config from './config';

const {DAILY_API_KEY, DAILY_DOMAIN_ID} = config;

export const generateSessionToken = async (
  roomName: string,
  isHost: boolean,
  expireDate: dayjs.Dayjs,
): Promise<string> => {
  const payload = {
    r: roomName,
    d: DAILY_DOMAIN_ID,
    iat: dayjs().unix(),
    exp: expireDate.unix(),
    o: isHost,
  };

  return jwt.sign(payload, DAILY_API_KEY);
};
