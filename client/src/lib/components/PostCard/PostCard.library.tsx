import React from 'react';
import ScreenWrapper from '../../uiLib/decorators/ScreenWrapper';
import SharingPostCard from './SharingPostCard';
import {FeedbackEvent, PostEvent} from '../../../../../shared/src/types/Event';
import {TextPostItem, VideoPostItem} from '../../posts/types/PostItem';
import {Spacer28} from '../Spacers/Spacer';
import {Heading16} from '../Typography/Heading/Heading';
import styled from 'styled-components/native';
import FeedbackPostCard from './FeedbackPostCard';
import {Feedback} from '../../../../../shared/src/types/Feedback';
import ExerciseSharingPostCard from './ExerciseSharingPostCard';

const DUMMY_PUBLIC_SHARING_POST_EVENT = {
  type: 'post',
  payload: {
    exerciseId: '1a53e633-6916-4fea-a072-977c4b215288',
    text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce sodales urna in turpis laoreet, et feugiat justo maximus. ',
    isAnonymous: false,
    isPublic: true,
  },
} as PostEvent;

const DUMMY_PUBLIC_ANONYMOUS_SHARING_POST_EVENT = {
  type: 'post',
  payload: {
    exerciseId: '1a53e633-6916-4fea-a072-977c4b215288',
    text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce sodales urna in turpis laoreet, et feugiat justo maximus. ',
    isAnonymous: true,
    isPublic: true,
  },
} as PostEvent;

const DUMMY_PRIVATE_SHARING_POST_EVENT = {
  type: 'post',
  payload: {
    exerciseId: '1a53e633-6916-4fea-a072-977c4b215288',
    text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce sodales urna in turpis laoreet, et feugiat justo maximus. ',
    isAnonymous: true,
    isPublic: false,
  },
} as PostEvent;

const DUMMY_SHARING_POST = {
  type: 'text',
  item: {
    exerciseId: '1a53e633-6916-4fea-a072-977c4b215288',
    text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce sodales urna in turpis laoreet, et feugiat justo maximus. ',
    userProfile: {
      displayName: 'Jenny Rickardsson',
      photoURL:
        'https://res.cloudinary.com/cupcake-29k/image/upload/t_cocreator_image/v1682602411/Images/Jenny_Rickardsson_kopia_sdodwf.jpg',
    },
  },
} as TextPostItem;

const DUMMY_ANONYMOUS_SHARING_POST = {
  type: 'text',
  item: {
    exerciseId: '1a53e633-6916-4fea-a072-977c4b215288',
    text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce sodales urna in turpis laoreet, et feugiat justo maximus. ',
    userProfile: null,
  },
} as TextPostItem;

const DUMMY_VIDEO_SHARING_POST = {
  type: 'video',
  item: {
    exerciseId: '1a53e633-6916-4fea-a072-977c4b215288',
    video: {
      source:
        'https://res.cloudinary.com/cupcake-29k/video/upload/q_auto/v1698746327/Video/summer_awp_exercise1_1-90th_birthday._Sharing_ajcory.mp4',
      preview:
        'https://res.cloudinary.com/cupcake-29k/image/upload/q_auto,t_global/v1698942056/Images/summer_awp_exercise1_1-90th_birthday_Image_cuhqhv.jpg',
      subtitles:
        'https://res.cloudinary.com/cupcake-29k/raw/upload/q_auto,t_global/v1699018035/SRT%20(captions)%20files/summer_awp_exercise1_1-90th_birthday._Sharing_d16bqx.srt',
    },
    profile: {
      displayName: 'Summer',
      photoURL:
        'https://res.cloudinary.com/cupcake-29k/image/upload/q_auto,t_global/v1698942056/Images/summer_awp_exercise1_1-90th_birthday_Image_cuhqhv.jpg',
    },
  },
} as VideoPostItem;

const DUMMY_LONG_SHARING_POST = {
  type: 'text',
  item: {
    exerciseId: '1a53e633-6916-4fea-a072-977c4b215288',
    text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce sodales urna in turpis laoreet, et feugiat justo maximus. Morbi lacinia consequat aliquam. Morbi sed varius ligula, eget gravida odio. Nulla eu enim at tellus iaculis vulputate ac suscipit elit. Praesent vulputate odio in erat elementum, id congue neque viverra. Phasellus id ligula scelerisque metus dapibus facilisis. Sed vel nibh in eros lobortis tempus nec ut diam. Nulla at congue sapien. Vivamus iaculis mi in leo placerat, egestas consequat orci consectetur. Phasellus lectus nibh, imperdiet nec est ac, ornare ullamcorper libero. Nullam ac felis ut turpis ultricies aliquam pellentesque auctor dolor.',
    userProfile: {
      displayName: 'Jenny Rickardsson',
      photoURL:
        'https://res.cloudinary.com/cupcake-29k/image/upload/t_cocreator_image/v1682602411/Images/Jenny_Rickardsson_kopia_sdodwf.jpg',
    },
  },
} as TextPostItem;

const MaxHeight = styled.View({
  height: 300,
});

export const SharingPostCards = () => (
  <ScreenWrapper>
    <Heading16>Public sharing post event</Heading16>
    <SharingPostCard sharingPost={DUMMY_PUBLIC_SHARING_POST_EVENT} />
    <Spacer28 />
    <Heading16>Public anonymous sharing post event</Heading16>
    <SharingPostCard sharingPost={DUMMY_PUBLIC_ANONYMOUS_SHARING_POST_EVENT} />
    <Spacer28 />
    <Heading16>Private sharing post event</Heading16>
    <SharingPostCard sharingPost={DUMMY_PRIVATE_SHARING_POST_EVENT} />
    <Spacer28 />
    <Heading16>Sharing post</Heading16>
    <SharingPostCard sharingPost={DUMMY_SHARING_POST} />
    <Spacer28 />
    <Heading16>Anonymous sharing post</Heading16>
    <SharingPostCard sharingPost={DUMMY_ANONYMOUS_SHARING_POST} />
    <Spacer28 />
    <Heading16>Video sharing post</Heading16>
    <SharingPostCard sharingPost={DUMMY_VIDEO_SHARING_POST} />
    <Spacer28 />
    <Heading16>Clipped sharing post</Heading16>
    <MaxHeight>
      <SharingPostCard sharingPost={DUMMY_LONG_SHARING_POST} clip />
    </MaxHeight>
    <Spacer28 />
    <Heading16>Clipped video sharing post</Heading16>
    <MaxHeight>
      <SharingPostCard sharingPost={DUMMY_VIDEO_SHARING_POST} clip />
    </MaxHeight>
  </ScreenWrapper>
);

export const ExerciseSharingPostCards = () => (
  <ScreenWrapper>
    <Heading16>Public sharing post event</Heading16>
    <ExerciseSharingPostCard sharingPost={DUMMY_PUBLIC_SHARING_POST_EVENT} />
    <Spacer28 />
    <Heading16>Public anonymous sharing post event</Heading16>
    <ExerciseSharingPostCard
      sharingPost={DUMMY_PUBLIC_ANONYMOUS_SHARING_POST_EVENT}
    />
    <Spacer28 />
    <Heading16>Private sharing post event</Heading16>
    <ExerciseSharingPostCard sharingPost={DUMMY_PRIVATE_SHARING_POST_EVENT} />
    <Spacer28 />
    <Heading16>Sharing post</Heading16>
    <ExerciseSharingPostCard sharingPost={DUMMY_SHARING_POST} />
    <Spacer28 />
    <Heading16>Anonymous sharing post</Heading16>
    <ExerciseSharingPostCard sharingPost={DUMMY_ANONYMOUS_SHARING_POST} />
    <Spacer28 />
    <Heading16>Video sharing post</Heading16>
    <ExerciseSharingPostCard sharingPost={DUMMY_VIDEO_SHARING_POST} />
    <Spacer28 />
    <Heading16>Clipped sharing post</Heading16>
    <MaxHeight>
      <ExerciseSharingPostCard sharingPost={DUMMY_LONG_SHARING_POST} clip />
    </MaxHeight>
    <Spacer28 />
    <Heading16>Clipped video sharing post</Heading16>
    <MaxHeight>
      <ExerciseSharingPostCard sharingPost={DUMMY_VIDEO_SHARING_POST} clip />
    </MaxHeight>
  </ScreenWrapper>
);

const DUMMY_POSITIVE_FEEDBACK_EVENT = {
  type: 'feedback',
  payload: {
    answer: true,
    comment:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce sodales urna in turpis laoreet, et feugiat justo maximus. ',
  },
  timestamp: '2020-10-10T10:10:10.000Z',
} as FeedbackEvent;

const DUMMY_NEGATIVE_FEEDBACK_EVENT = {
  type: 'feedback',
  payload: {
    answer: false,
    comment:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce sodales urna in turpis laoreet, et feugiat justo maximus. ',
  },
  timestamp: '2020-10-10T10:10:10.000Z',
} as FeedbackEvent;

const DUMMY_POSITIVE_FEEDBACK_POST = {
  answer: true,
  comment:
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce sodales urna in turpis laoreet, et feugiat justo maximus. ',
  createdAt: '2020-10-10T10:10:10.000Z',
} as Feedback;

const DUMMY_NEGATIVE_FEEDBACK_POST = {
  answer: false,
  comment:
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce sodales urna in turpis laoreet, et feugiat justo maximus. ',

  createdAt: '2020-10-10T10:10:10.000Z',
} as Feedback;

const DUMMY_LONG_FEEDBACK_POST = {
  answer: false,
  comment:
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce sodales urna in turpis laoreet, et feugiat justo maximus. Morbi lacinia consequat aliquam. Morbi sed varius ligula, eget gravida odio. Nulla eu enim at tellus iaculis vulputate ac suscipit elit. Praesent vulputate odio in erat elementum, id congue neque viverra. Phasellus id ligula scelerisque metus dapibus facilisis. Sed vel nibh in eros lobortis tempus nec ut diam. Nulla at congue sapien. Vivamus iaculis mi in leo placerat, egestas consequat orci consectetur. Phasellus lectus nibh, imperdiet nec est ac, ornare ullamcorper libero. Nullam ac felis ut turpis ultricies aliquam pellentesque auctor dolor.',
  createdAt: '2020-10-10T10:10:10.000Z',
} as Feedback;

export const FeedbackPostCards = () => (
  <ScreenWrapper>
    <Heading16>Positive feedback event</Heading16>
    <FeedbackPostCard feedbackPost={DUMMY_POSITIVE_FEEDBACK_EVENT} />
    <Spacer28 />
    <Heading16>Negative feedback event</Heading16>
    <FeedbackPostCard feedbackPost={DUMMY_NEGATIVE_FEEDBACK_EVENT} />
    <Spacer28 />
    <Heading16>Positive feedback post</Heading16>
    <FeedbackPostCard feedbackPost={DUMMY_POSITIVE_FEEDBACK_POST} />
    <Spacer28 />
    <Heading16>Negative feedback post</Heading16>
    <FeedbackPostCard feedbackPost={DUMMY_NEGATIVE_FEEDBACK_POST} />
    <Spacer28 />
    <Heading16>Clipped feedback post</Heading16>
    <MaxHeight>
      <FeedbackPostCard feedbackPost={DUMMY_LONG_FEEDBACK_POST} clip />
    </MaxHeight>
    <Spacer28 />
  </ScreenWrapper>
);
