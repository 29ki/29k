import {renderHook} from '@testing-library/react-hooks';
import {Exercise} from '../../../../../shared/src/types/generated/Exercise';
import {
  AsyncSessionType,
  SessionStateType,
} from '../../../../../shared/src/schemas/Session';
import useSessionState from '../state/state';
import useAsyncSessionSlideState from './useAsyncSessionSlideState';

describe('useAsyncSessionSlideState', () => {
  it('should return null if no exercise exists', () => {
    useSessionState.setState({
      exercise: null,
    });

    const {result} = renderHook(() => useAsyncSessionSlideState());

    expect(result.current).toBe(null);
  });

  it('should remove host and reflection slides', () => {
    useSessionState.setState({
      asyncSession: {
        exerciseId: 'some-content',
      } as AsyncSessionType,
      sessionState: {
        index: 1,
      } as SessionStateType,
      exercise: {
        slides: [
          {type: 'content'},
          {type: 'host'},
          {type: 'reflection'},
          {type: 'sharing'},
        ],
      } as Exercise,
    });

    const {result} = renderHook(() => useAsyncSessionSlideState());

    expect(result.current).toEqual({
      index: 1,
      current: {type: 'sharing'},
      next: undefined,
      previous: {type: 'content'},
      slides: [{type: 'content'}, {type: 'sharing'}],
    });
  });

  it('should memoize return', () => {
    useSessionState.setState({
      sessionState: {
        index: 1,
      } as SessionStateType,
      exercise: {
        slides: [
          {type: 'content'},
          {type: 'host'},
          {type: 'reflection'},
          {type: 'sharing'},
        ],
      } as Exercise,
    });

    const {result, rerender} = renderHook(() => useAsyncSessionSlideState());

    rerender();

    expect(result.all.length).toBe(2);
    expect(result.all[0]).toBe(result.all[1]);
  });

  it('should return only current slide', () => {
    useSessionState.setState({
      asyncSession: {exerciseId: 'some-content'} as AsyncSessionType,
      sessionState: {index: 0} as SessionStateType,
      exercise: {
        slides: [{type: 'content'}],
      } as Exercise,
    });

    const {result} = renderHook(() => useAsyncSessionSlideState());

    expect(result.current).toEqual({
      index: 0,
      current: {type: 'content'},
      next: undefined,
      previous: undefined,
      slides: [{type: 'content'}],
    });
  });
});
