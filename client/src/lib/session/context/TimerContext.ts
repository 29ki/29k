import {createContext} from 'react';

export type OnTimerProgress = (currentTime: number, duration: number) => void;

export const TimerContext = createContext<OnTimerProgress | undefined>(
  undefined,
);
