import dayjs from 'dayjs';
import jwt from 'jsonwebtoken';
import MockDate from 'mockdate';
import {generateSessionToken} from './dailyUtils';

MockDate.set('2023-01-05T11:47:35'); // NOW

beforeEach(() => {
  jest.resetAllMocks();
});

describe('dailyUtils', () => {
  it('should create expected token for host', async () => {
    const token = await generateSessionToken(
      'some-user-id',
      'some-room-name',
      true,
      dayjs('2023-01-06T10:00:00'),
    );

    expect(jwt.decode(token)).toMatchObject({
      ud: 'some-user-id',
      d: 'some-domain-id',
      o: true,
      r: 'some-room-name',
    });
  });

  it('should create expected token for non host', async () => {
    const token = await generateSessionToken(
      'some-user-id',
      'some-room-name',
      false,
      dayjs('2023-01-06T10:00:00'),
    );

    expect(jwt.decode(token)).toMatchObject({
      ud: 'some-user-id',
      d: 'some-domain-id',
      o: false,
      r: 'some-room-name',
    });
  });
});
