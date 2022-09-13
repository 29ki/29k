import {createContext} from 'react';

export const DailyContext = createContext<{toggleAudio: () => void}>({
  toggleAudio: jest.fn(),
});
