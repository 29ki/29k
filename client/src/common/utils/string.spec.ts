import {formatInviteCode} from './string';

describe('formatInviteCode', () => {
  it('adds space every three digits', () => {
    expect(formatInviteCode(123456789)).toBe('123 456 789');
  });
});
