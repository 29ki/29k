import 'dotenv/config';
import {cleanEnv, str} from 'envalid';

const configValidation = {
  ENVIRONMENT: str(),
};

export default cleanEnv(process.env, configValidation);
