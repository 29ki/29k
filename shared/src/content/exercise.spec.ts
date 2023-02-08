import {Exercise} from '../types/generated/Exercise';
import {getSharingSlideById} from './exercise';

describe('exercise', () => {
  describe('getSharingSlideById', () => {
    it('should get sharing exercise', () => {
      expect(
        getSharingSlideById(
          {
            slides: [{type: 'sharing', id: 'sharing-id'}],
          } as Exercise,
          'sharing-id',
        ),
      ).toEqual({type: 'sharing', id: 'sharing-id'});
    });

    it('should return undifined when no exercise found', () => {
      expect(
        getSharingSlideById(
          {
            slides: [{type: 'sharing', id: 'sharing-id'}],
          } as Exercise,
          'sharing-other-id',
        ),
      ).toBe(undefined);
    });

    it('should return undifined when no exercise', () => {
      expect(getSharingSlideById(undefined, 'sharing-other-id')).toBe(
        undefined,
      );
    });
  });
});
