import {Collection} from '../../../../shared/src/types/generated/Collection';
import {Exercise} from '../../../../shared/src/types/generated/Exercise';

export const formatInviteCode = (code: number) =>
  (code.toString().match(/\d{1,3}/g) ?? []).join(' ');

export const formatContentName = (content: Exercise | Collection | null) =>
  content?.hidden ? `${content.name} (hidden)` : content?.name;

export const trimSlashes = (str: string) => str.replace(/^\/+|\/+$/g, '');
