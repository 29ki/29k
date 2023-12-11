import content from '../../../content/content.json';
import {DEFAULT_LANGUAGE_TAG} from '../i18n/constants';

export type I18nNamespace =
  keyof (typeof content.i18n)[typeof DEFAULT_LANGUAGE_TAG];
