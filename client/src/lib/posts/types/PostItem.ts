import {PostType} from '../../../../../shared/src/schemas/Post';
import {ExerciseSlideSharingSlideSharingVideos} from '../../../../../shared/src/types/generated/Exercise';

export type TextPostItem = {
  type: 'text';
  item: PostType;
};

export type VideoPostItem = {
  type: 'video';
  item: ExerciseSlideSharingSlideSharingVideos;
};

export type PostItem = TextPostItem | VideoPostItem;
