import {CollectionWithLanguage, ExerciseWithLanguage} from '../content/types';

export const formatInviteCode = (code: number) =>
  (code.toString().match(/\d{1,3}/g) ?? []).join(' ');

export const formatContentName = (
  content: ExerciseWithLanguage | CollectionWithLanguage | null,
) => (content?.hidden ? `${content.name} (hidden)` : content?.name);

export const trimSlashes = (str: string) => str.replace(/^\/+|\/+$/g, '');
