import React from 'react';
import {renderHook} from '@testing-library/react-hooks';
import {RecoilRoot} from 'recoil';

import {sessionAtom} from '../state/state';
import {
  ExerciseStateInput,
  SessionInput,
} from '../../../../../shared/src/types/Session';

afterEach(() => {
  jest.clearAllMocks();
});

const mockToggleAudio = jest.fn();

jest.mock('../DailyProvider');
jest.mock('./useSessionExercise', () => jest.fn());

import {DailyContext, DailyProviderTypes} from '../DailyProvider';
import useMuteAudioListener from './useMuteAudioListener';
import useSessionExercise from './useSessionExercise';

const mockUseSessionExercise = useSessionExercise as jest.Mock;

describe('useMuteAudioListener', () => {
  it('should toggle audio when state is playing and current slide is not sharing', async () => {
    const wrapper: React.FC<{children: React.ReactNode}> = ({children}) => (
      <RecoilRoot
        initializeState={({set}) => {
          set(sessionAtom, {
            exerciseState: {playing: true} as ExerciseStateInput,
          } as SessionInput);
        }}>
        <DailyContext.Provider
          value={
            {toggleAudio: mockToggleAudio} as unknown as DailyProviderTypes
          }>
          {children}
        </DailyContext.Provider>
      </RecoilRoot>
    );

    mockUseSessionExercise.mockReturnValue({
      slide: {current: {type: 'reflection'}},
    });

    renderHook(() => useMuteAudioListener(), {
      wrapper,
    });

    expect(mockToggleAudio).toHaveBeenCalledTimes(1);
  });

  it('should not toggle audio when state is not playing', async () => {
    const wrapper: React.FC<{children: React.ReactNode}> = ({children}) => (
      <RecoilRoot
        initializeState={({set}) => {
          set(sessionAtom, {
            exerciseState: {playing: false} as ExerciseStateInput,
          } as SessionInput);
        }}>
        <DailyContext.Provider
          value={
            {toggleAudio: mockToggleAudio} as unknown as DailyProviderTypes
          }>
          {children}
        </DailyContext.Provider>
      </RecoilRoot>
    );

    mockUseSessionExercise.mockReturnValue({
      slide: {current: {type: 'reflection'}},
    });

    renderHook(() => useMuteAudioListener(), {
      wrapper,
    });

    expect(mockToggleAudio).toHaveBeenCalledTimes(0);
  });

  it('should not toggle audio when current slide is sharing', async () => {
    const wrapper: React.FC<{children: React.ReactNode}> = ({children}) => (
      <RecoilRoot
        initializeState={({set}) => {
          set(sessionAtom, {
            exerciseState: {playing: true} as ExerciseStateInput,
          } as SessionInput);
        }}>
        <DailyContext.Provider
          value={
            {toggleAudio: mockToggleAudio} as unknown as DailyProviderTypes
          }>
          {children}
        </DailyContext.Provider>
      </RecoilRoot>
    );

    mockUseSessionExercise.mockReturnValue({
      slide: {current: {type: 'sharing'}},
    });

    renderHook(() => useMuteAudioListener(), {
      wrapper,
    });

    expect(mockToggleAudio).toHaveBeenCalledTimes(0);
  });
});
