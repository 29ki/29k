import 'dotenv/config';

type Config = {
  DAILY_API_KEY: string;
  DAILY_API_URL: string;
  DAILY_API_VERSION: string;
};

if (!process.env.DAILY_API_KEY)
  throw Error('Missing env variable DAILY_API_KEY');
if (!process.env.DAILY_API_URL)
  throw Error('Missing env variable DAILY_API_URl');
if (!process.env.DAILY_API_VERSION)
  throw Error('Missing env variable DAILY_API_VERSION');

export default {
  DAILY_API_KEY: process.env.DAILY_API_KEY,
  DAILY_API_URL: process.env.DAILY_API_URL,
  DAILY_API_VERSION: process.env.DAILY_API_VERSION,
} as Config;
