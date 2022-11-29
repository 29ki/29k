import 'dotenv/config';
import {cleanEnv, str} from 'envalid';

const configValidation = {
  ENVIRONMENT: str({default: 'dev'}),
};

export default cleanEnv(process.env, configValidation);
