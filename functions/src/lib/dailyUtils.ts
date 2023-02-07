import dayjs from 'dayjs';
import jwt from 'jsonwebtoken';
import config from './config';

const {DAILY_API_KEY, DAILY_DOMAIN_ID} = config;

export const generateSessionToken = async (
  userId: string,
  roomName: string,
  isHost: boolean,
  expireDate: dayjs.Dayjs,
): Promise<string> => {
  const payload = {
    ud: userId,
    r: roomName,
    d: DAILY_DOMAIN_ID,
    exp: expireDate.unix(),
    o: isHost,
  };

  return jwt.sign(payload, DAILY_API_KEY);
};
