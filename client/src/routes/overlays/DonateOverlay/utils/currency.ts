import {head, intersection} from 'ramda';
import {getLocales, getCurrencies} from 'react-native-localize';
import {
  DEFAULT_LANGUAGE_TAG,
  LANGUAGE_TAG,
  CURRENCY_CODES,
  DEFAULT_CURRENCY_CODE,
  CURRENCY_CODE,
} from '../../../../lib/i18n';

export const preferedLanguageTag = (head(getLocales())?.languageTag ||
  DEFAULT_LANGUAGE_TAG) as LANGUAGE_TAG;

export const preferedCurrency = head(
  intersection(CURRENCY_CODES, [...getCurrencies(), DEFAULT_CURRENCY_CODE]),
) as CURRENCY_CODE;

export const formatCurrency = (amount: number) =>
  Intl.NumberFormat(preferedLanguageTag, {
    style: 'currency',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
    currency: preferedCurrency,
  }).format(amount);
