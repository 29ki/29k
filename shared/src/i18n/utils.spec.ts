import {removeHidden, removeHiddenExercises} from './utils';

describe('utils', () => {
  describe('removeHiddenExercises', () => {
    it('should remove hidden exercises', () => {
      expect(
        removeHiddenExercises({'exercise-1': {}, 'exercise-2': {hidden: true}}),
      ).toEqual({
        'exercise-1': {},
      });
    });
  });

  describe('removeHidden', () => {
    it('should remove hidden exercises from all lanugages', () => {
      expect(
        removeHidden({
          en: {
            exercises: {
              'exercise-1': {},
              'exercise-2': {hidden: true},
            },
          },
          pt: {
            exercises: {
              'exercise-1': {hidden: true},
              'exercise-2': {},
            },
          },
          sv: {exercises: {}},
          es: {exercises: {}},
        }),
      ).toEqual({
        en: {exercises: {'exercise-1': {}}},
        pt: {exercises: {'exercise-2': {}}},
        sv: {exercises: {}},
        es: {exercises: {}},
      });
    });
  });
});
