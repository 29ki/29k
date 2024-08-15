import {LANGUAGE_TAG} from '../../../../shared/src/i18n/constants';
import {Collection} from '../../../../shared/src/types/generated/Collection';
import {Exercise} from '../../../../shared/src/types/generated/Exercise';

export type CollectionWithLanguage = Collection & {language: LANGUAGE_TAG};
export type ExerciseWithLanguage = Exercise & {language: LANGUAGE_TAG};
