import {Timestamp} from 'firebase-admin/firestore';
import {transformTimestamp} from './transform';

describe('transfrom', () => {
  describe('transformTimestamp', () => {
    it('should tarnsform Timestam to iso string', () => {
      expect(
        transformTimestamp.validateSync(
          Timestamp.fromDate(new Date('2023-04-21T10:00:00')),
        ),
      ).toEqual('2023-04-21T10:00:00.000Z');
    });

    it('should handle undefined', () => {
      expect(transformTimestamp.validateSync(undefined)).toBe(undefined);
    });
  });
});
