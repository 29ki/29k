import {ExerciseWithLanguage} from '../content/types';
import {formatContentName, formatInviteCode, trimSlashes} from './string';

describe('formatInviteCode', () => {
  it('adds space every three digits', () => {
    expect(formatInviteCode(123456789)).toBe('123 456 789');
  });
});

describe('formatExerciseName', () => {
  it('should add WIP to hidden exercises', () => {
    expect(
      formatContentName({name: 'Test', hidden: true} as ExerciseWithLanguage),
    ).toEqual('Test (hidden)');
  });

  it('should not add WIP to non hidden exercises', () => {
    expect(formatContentName({name: 'Test'} as ExerciseWithLanguage)).toEqual(
      'Test',
    );
  });
});

describe('trimSlashes', () => {
  it('trims slashes', () => {
    expect(trimSlashes('/foo/bar/')).toBe('foo/bar');
  });
});
