import {renderHook} from '@testing-library/react-hooks';
import {DailyParticipant} from '@daily-co/react-native-daily-js';
import useDailyState from './state';
import {act} from 'react-test-renderer';

describe('Daily state', () => {
  describe('setParticipant', () => {
    it('sets participants state', () => {
      const {result} = renderHook(() => useDailyState());

      act(() => {
        result.current.setParticipant('some-id', {
          user_id: 'some-id',
        } as DailyParticipant);
      });

      expect(result.current.participants).toEqual({
        'some-id': {user_id: 'some-id'},
      });
    });
  });

  describe('setParticipantsSortOrder', () => {
    it('should change order if participant is not first or second', () => {
      useDailyState.setState({
        participants: {
          'user-1': {
            session_id: 'session-id-1',
            user_id: 'user-1',
          } as DailyParticipant,
          'user-2': {
            session_id: 'session-id-2',
            user_id: 'user-2',
          } as DailyParticipant,
          'user-3': {
            session_id: 'session-id-3',
            user_id: 'user-3',
          } as DailyParticipant,
        },
        participantsSortOrder: ['user-1', 'user-2'],
      });
      const {result} = renderHook(() => useDailyState());

      act(() => {
        result.current.setParticipantsSortOrder('session-id-3');
      });

      expect(result.current.participantsSortOrder).toEqual([
        'user-3',
        'user-1',
        'user-2',
      ]);
    });

    it('should not change order if participant is already first', () => {
      useDailyState.setState({
        participants: {
          'user-1': {
            session_id: 'session-id-1',
            user_id: 'user-1',
          } as DailyParticipant,
          'user-2': {
            session_id: 'session-id-2',
            user_id: 'user-2',
          } as DailyParticipant,
          'user-3': {
            session_id: 'session-id-3',
            user_id: 'user-3',
          } as DailyParticipant,
        },
        participantsSortOrder: ['user-1', 'user-2'],
      });
      const {result} = renderHook(() => useDailyState());

      act(() => {
        result.current.setParticipantsSortOrder('session-id-1');
      });

      expect(result.current.participantsSortOrder).toEqual([
        'user-1',
        'user-2',
      ]);
    });

    it('should not change order if participant is already second', () => {
      useDailyState.setState({
        participants: {
          'user-1': {
            session_id: 'session-id-1',
            user_id: 'user-1',
          } as DailyParticipant,
          'user-2': {
            session_id: 'session-id-2',
            user_id: 'user-2',
          } as DailyParticipant,
          'user-3': {
            session_id: 'session-id-3',
            user_id: 'user-3',
          } as DailyParticipant,
        },
        participantsSortOrder: ['user-1', 'user-2'],
      });
      const {result} = renderHook(() => useDailyState());

      act(() => {
        result.current.setParticipantsSortOrder('session-id-2');
      });

      expect(result.current.participantsSortOrder).toEqual([
        'user-1',
        'user-2',
      ]);
    });
  });

  describe('removeParticipant', () => {
    it('removed from participants and participantsSortOrder states', () => {
      useDailyState.setState({
        participants: {
          'some-id': {
            user_id: 'some-id',
          } as DailyParticipant,
          'some-other-id': {
            user_id: 'some-other-id',
          } as DailyParticipant,
        },
        participantsSortOrder: ['some-id', 'some-other-id'],
      });

      const {result} = renderHook(() => useDailyState());

      act(() => {
        result.current.removeParticipant('some-id');
      });

      expect(result.current.participants).toEqual({
        'some-other-id': {user_id: 'some-other-id'},
      });
      expect(result.current.participantsSortOrder).toEqual(['some-other-id']);
    });
  });

  describe('reset', () => {
    it('resets state to inital state', () => {
      useDailyState.setState({
        participants: {
          'some-id': {
            user_id: 'some-id',
          } as DailyParticipant,
          'some-other-id': {
            user_id: 'some-other-id',
          } as DailyParticipant,
        },
        participantsSortOrder: ['some-id', 'some-other-id'],
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
