import {SharingSessionProperties, SharingSessionDuration} from './Properties';

type Events = {
  // Sharing Sessions
  'Create Sharing Session': SharingSessionProperties;
  'Join Sharing Session': SharingSessionProperties;
  'Add Sharing Session': SharingSessionProperties;
  'Enter Changing Room': SharingSessionProperties;
  'Enter Intro Portal': SharingSessionProperties;
  'Start Sharing Session': SharingSessionProperties;
  'Enter Sharing Session': SharingSessionProperties;
  'Leave Sharing Session': SharingSessionProperties & SharingSessionDuration;
  'Complete Sharing Session': SharingSessionProperties & SharingSessionDuration;
  'Enter Outro Portal': SharingSessionProperties;
  'Add Sharing Session To Interested': SharingSessionProperties;
  'Add Sharing Session To Calendar': SharingSessionProperties;
  'Add Sharing Session Reminder': SharingSessionProperties;
  'Share Sharing Session': SharingSessionProperties;
};

export default Events;
