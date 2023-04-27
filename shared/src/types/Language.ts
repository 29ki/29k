import * as yup from 'yup';
import {LANGUAGE_TAG, LANGUAGE_TAGS} from '../constants/i18n';

export const LanguageSchema = yup.mixed<LANGUAGE_TAG>().oneOf(LANGUAGE_TAGS);
