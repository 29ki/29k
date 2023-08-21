import {createContext} from 'react';

export type ProgressTimerContextProps = {
  onLoad: (duration: number) => void;
  onSeek: (currentTime: number) => void;
};

export const ProgressTimerContext = createContext<
  ProgressTimerContextProps | undefined
>(undefined);
