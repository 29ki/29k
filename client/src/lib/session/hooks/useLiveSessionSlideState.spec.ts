import {renderHook} from '@testing-library/react-hooks';
import {
  LiveSessionType,
  SessionStateType,
} from '../../../../../shared/src/schemas/Session';
import useSessionState from '../state/state';
import useLiveSessionSlideState from './useLiveSessionSlideState';
import {ExerciseWithLanguage} from '../../content/types';

describe('useLiveSessionSlideState', () => {
  it('should return null if no exercise exists', () => {
    useSessionState.setState({
      exercise: null,
    });

    const {result} = renderHook(() => useLiveSessionSlideState());

    expect(result.current).toBe(null);
  });

  it('should return null if no session exists', () => {
    useSessionState.setState({
      liveSession: null,
    });
    const {result} = renderHook(() => useLiveSessionSlideState());

    expect(result.current).toBe(null);
  });

  it('should return slide state', () => {
    useSessionState.setState({
      liveSession: {
        exerciseId: 'some-content',
      } as LiveSessionType,
      sessionState: {
        index: 1,
      } as SessionStateType,
      exercise: {
        slides: [{type: 'content'}, {type: 'host'}, {type: 'reflection'}],
      } as ExerciseWithLanguage,
    });

    const {result} = renderHook(() => useLiveSessionSlideState());

    expect(result.current).toEqual({
      index: 1,
      current: {type: 'host'},
      next: {type: 'reflection'},
      previous: {type: 'content'},
      slides: [{type: 'content'}, {type: 'host'}, {type: 'reflection'}],
    });
  });

  it('should memoize return', () => {
    useSessionState.setState({
      sessionState: {
        index: 1,
      } as SessionStateType,
      exercise: {
        slides: [{type: 'content'}, {type: 'host'}, {type: 'reflection'}],
      } as ExerciseWithLanguage,
    });

    const {result, rerender} = renderHook(() => useLiveSessionSlideState());

    rerender();

    expect(result.all.length).toBe(2);
    expect(result.all[0]).toBe(result.all[1]);
  });

  it('should return only current slide', () => {
    useSessionState.setState({
      liveSession: {exerciseId: 'some-content'} as LiveSessionType,
      sessionState: {index: 0} as SessionStateType,
      exercise: {
        slides: [{type: 'content'}],
      } as ExerciseWithLanguage,
    });

    const {result} = renderHook(() => useLiveSessionSlideState());

    expect(result.current).toEqual({
      index: 0,
      current: {type: 'content'},
      next: undefined,
      previous: undefined,
      slides: [{type: 'content'}],
    });
  });
});
