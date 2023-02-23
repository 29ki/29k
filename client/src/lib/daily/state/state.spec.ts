import {renderHook} from '@testing-library/react-hooks';
import {DailyParticipant} from '@daily-co/react-native-daily-js';
import useDailyState from './state';
import {act} from 'react-test-renderer';

describe('Daily state', () => {
  describe('setParticipant', () => {
    it('sets participants state', () => {
      const {result} = renderHook(() => useDailyState());

      act(() => {
        result.current.setParticipant('some-session-id', {
          user_id: 'some-id',
          session_id: 'some-session-id',
        } as DailyParticipant);
      });

      expect(result.current.participants).toEqual({
        'some-session-id': {user_id: 'some-id', session_id: 'some-session-id'},
      });
    });
  });

  describe('setParticipantsSortOrder', () => {
    it('should change order if participant is not first or second', () => {
      useDailyState.setState({
        participants: {
          'session-id-1': {
            session_id: 'session-id-1',
            user_id: 'user-1',
          } as DailyParticipant,
          'session-id-2': {
            session_id: 'session-id-2',
            user_id: 'user-2',
          } as DailyParticipant,
          'session-id-3': {
            session_id: 'session-id-3',
            user_id: 'user-3',
          } as DailyParticipant,
        },
        participantsSortOrder: ['session-id-1', 'session-id-2'],
      });
      const {result} = renderHook(() => useDailyState());

      act(() => {
        result.current.setParticipantsSortOrder('session-id-3');
      });

      expect(result.current.participantsSortOrder).toEqual([
        'session-id-3',
        'session-id-1',
        'session-id-2',
      ]);
    });

    it('should not change order if participant is already first', () => {
      useDailyState.setState({
        participants: {
          'session-id-1': {
            session_id: 'session-id-1',
            user_id: 'user-1',
          } as DailyParticipant,
          'session-id-2': {
            session_id: 'session-id-2',
            user_id: 'user-2',
          } as DailyParticipant,
          'session-id-3': {
            session_id: 'session-id-3',
            user_id: 'user-3',
          } as DailyParticipant,
        },
        participantsSortOrder: ['session-id-1', 'session-id-2'],
      });
      const {result} = renderHook(() => useDailyState());

      act(() => {
        result.current.setParticipantsSortOrder('session-id-1');
      });

      expect(result.current.participantsSortOrder).toEqual([
        'session-id-1',
        'session-id-2',
      ]);
    });

    it('should not change order if participant is already second', () => {
      useDailyState.setState({
        participants: {
          'session-id-1': {
            session_id: 'session-id-1',
            user_id: 'user-1',
          } as DailyParticipant,
          'session-id-2': {
            session_id: 'session-id-2',
            user_id: 'user-2',
          } as DailyParticipant,
          'session-id-3': {
            session_id: 'session-id-3',
            user_id: 'user-3',
          } as DailyParticipant,
        },
        participantsSortOrder: ['session-id-1', 'session-id-2'],
      });
      const {result} = renderHook(() => useDailyState());

      act(() => {
        result.current.setParticipantsSortOrder('session-id-2');
      });

      expect(result.current.participantsSortOrder).toEqual([
        'session-id-1',
        'session-id-2',
      ]);
    });
  });

  describe('removeParticipant', () => {
    it('removed from participants and participantsSortOrder states', () => {
      useDailyState.setState({
        participants: {
          'some-session-id': {
            user_id: 'some-id',
            session_id: 'some-session-id',
          } as DailyParticipant,
          'some-other-session-id': {
            user_id: 'some-other-id',
            session_id: 'some-other-session-id',
          } as DailyParticipant,
        },
        participantsSortOrder: ['some-session-id', 'some-other-session-id'],
      });

      const {result} = renderHook(() => useDailyState());

      act(() => {
        result.current.removeParticipant('some-session-id');
      });

      expect(result.current.participants).toEqual({
        'some-other-session-id': {
          user_id: 'some-other-id',
          session_id: 'some-other-session-id',
        },
      });
      expect(result.current.participantsSortOrder).toEqual([
        'some-other-session-id',
      ]);
    });
  });

  describe('reset', () => {
    it('resets state to inital state', () => {
      useDailyState.setState({
        participants: {
          'some-session-id': {
            user_id: 'some-id',
            session_id: 'some-session-id',
          } as DailyParticipant,
          'some-other-session-id': {
            user_id: 'some-other-id',
            session_id: 'some-other-session-id',
          } as DailyParticipant,
        },
        participantsSortOrder: ['some-session-id', 'some-other-session-id'],
      });

      const {result} = renderHook(() => useDailyState());

      act(() => {
        result.current.reset();
      });

      expect(result.current.participants).toEqual({});
      expect(result.current.participantsSortOrder).toEqual([]);
    });
  });
});
