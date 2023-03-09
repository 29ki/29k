import {
  SharingSessionProperties,
  SharingSessionDuration,
  FeedbackProperties,
  ScreenName,
  SharingSessionPost,
} from './Properties';

type Events = {
  // Navigation
  Screen: ScreenName;
  'Open Link': {URL: string};

  // Outside Sharing Sessions
  'Create Sharing Session': SharingSessionProperties;
  'Join Sharing Session': SharingSessionProperties;
  'Add Sharing Session': SharingSessionProperties;
  'Add Sharing Session To Interested': SharingSessionProperties;
  'Add Sharing Session To Calendar': SharingSessionProperties;
  'Add Sharing Session Reminder': SharingSessionProperties;
  'Share Sharing Session': SharingSessionProperties;

  // Inside Sharing Sessions
  'Enter Changing Room': SharingSessionProperties & SharingSessionDuration;
  'Enter Intro Portal': SharingSessionProperties & SharingSessionDuration;
  'Start Sharing Session': SharingSessionProperties & SharingSessionDuration;
  'Enter Sharing Session': SharingSessionProperties & SharingSessionDuration;
  'Leave Sharing Session': SharingSessionProperties & SharingSessionDuration;
  'Complete Sharing Session': SharingSessionProperties & SharingSessionDuration;
  'Enter Outro Portal': SharingSessionProperties & SharingSessionDuration;

  // Async Sharing Sessions
  'Create Async Session': SharingSessionProperties;
  'Create Async Post': SharingSessionProperties & SharingSessionPost;
  'Completed Async Session': SharingSessionProperties;
  'Share Async Session': SharingSessionProperties;

  // Feedback
  'Sharing Session Feedback': FeedbackProperties;
};

export default Events;
