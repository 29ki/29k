'use client';

import {LANGUAGE_TAG} from '../../../shared/src/i18n/constants';
import * as i18n from '../../../client/src/lib/i18n';

export default function I18nProvider({
  children,
  language,
}: {
  children: React.ReactNode;
  language: LANGUAGE_TAG;
}) {
  i18n.init(language);

  return children;
}
