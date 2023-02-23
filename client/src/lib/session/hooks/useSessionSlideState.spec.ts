import {renderHook} from '@testing-library/react-hooks';
import {Exercise} from '../../../../../shared/src/types/generated/Exercise';
import {
  LiveSession,
  SessionState,
} from '../../../../../shared/src/types/Session';
import useSessionState from '../state/state';
import useSessionSlideState from './useSessionSlideState';

describe('useSessionSlideState', () => {
  it('should return null if no exercise exists', () => {
    useSessionState.setState({
      exercise: null,
    });

    const {result} = renderHook(() => useSessionSlideState());

    expect(result.current).toBe(null);
  });

  it('should return null if no session exists', () => {
    useSessionState.setState({
      liveSession: null,
    });
    const {result} = renderHook(() => useSessionSlideState());

    expect(result.current).toBe(null);
  });

  it('should return slide state', () => {
    useSessionState.setState({
      liveSession: {
        exerciseId: 'some-content',
      } as LiveSession,
      sessionState: {
        index: 1,
      } as SessionState,
      exercise: {
        slides: [{type: 'content'}, {type: 'host'}, {type: 'reflection'}],
      } as Exercise,
    });

    const {result} = renderHook(() => useSessionSlideState());

    expect(result.current).toEqual({
      index: 1,
      current: {type: 'host'},
      next: {type: 'reflection'},
      previous: {type: 'content'},
    });
  });

  it('should memoize return', () => {
    useSessionState.setState({
      sessionState: {
        index: 1,
      } as SessionState,
      exercise: {
        slides: [{type: 'content'}, {type: 'host'}, {type: 'reflection'}],
      } as Exercise,
    });

    const {result, rerender} = renderHook(() => useSessionSlideState());

    rerender();

    expect(result.all.length).toBe(2);
    expect(result.all[0]).toBe(result.all[1]);
  });

  it('should return only current slide', () => {
    useSessionState.setState({
      liveSession: {exerciseId: 'some-content'} as LiveSession,
      sessionState: {index: 0} as SessionState,
      exercise: {
        slides: [{type: 'content'}],
      } as Exercise,
    });

    const {result} = renderHook(() => useSessionSlideState());

    expect(result.current).toEqual({
      index: 0,
      current: {type: 'content'},
      next: undefined,
      previous: undefined,
    });
  });
});
