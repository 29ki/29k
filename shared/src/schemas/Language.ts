import * as yup from 'yup';
import {LANGUAGE_TAG, LANGUAGE_TAGS} from '../i18n/constants';

export const LanguageSchema = yup.mixed<LANGUAGE_TAG>().oneOf(LANGUAGE_TAGS);
