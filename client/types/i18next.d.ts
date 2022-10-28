// https://www.i18next.com/overview/typescript
import 'i18next';
import content from '../../content/content.json';
import {DEFAULT_LANGUAGE_TAG} from '../../shared/src/constants/i18n';

const resources = content.i18n[DEFAULT_LANGUAGE_TAG];

declare module 'i18next' {
  interface CustomTypeOptions {
    resources: typeof resources;
  }
}
