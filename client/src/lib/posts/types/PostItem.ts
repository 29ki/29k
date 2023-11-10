import {PostType} from '../../../../../shared/src/schemas/Post';
import {ExerciseSlideSharingSlideSharingVideo} from '../../../../../shared/src/types/generated/Exercise';

export type TextPostItem = {
  type: 'text';
  item: PostType;
};

export type VideoPostItem = {
  type: 'video';
  item: ExerciseSlideSharingSlideSharingVideo & {
    exerciseId: string;
    sharingId: string;
  };
};

export type PostItem = TextPostItem | VideoPostItem;
