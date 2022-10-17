import {createContext} from 'react';

export const DailyContext = createContext<{
  toggleAudio: () => void;
  leaveMeeting: () => void;
}>({
  toggleAudio: jest.fn(),
  leaveMeeting: jest.fn(),
});
