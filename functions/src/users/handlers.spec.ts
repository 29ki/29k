import {ROLE} from '../../../shared/src/schemas/User';
import {updateRole} from '../models/auth';
import {userUpdatedHandler} from './handlers';

jest.mock('../models/auth');

const mockUpdateRole = jest.mocked(updateRole);

beforeEach(() => {
  jest.clearAllMocks();
});

describe('handlers', () => {
  describe('userUpdatedHandler', () => {
    it('should update the claims if public host role was added', async () => {
      userUpdatedHandler('some-user-id', undefined, {role: ROLE.publicHost});
      expect(mockUpdateRole).toHaveBeenCalledWith(
        'some-user-id',
        ROLE.publicHost,
      );
    });

    it('should not update the claims if public host role was not updated', async () => {
      userUpdatedHandler(
        'some-user-id',
        {role: ROLE.publicHost},
        {role: ROLE.publicHost},
      );
      expect(mockUpdateRole).toHaveBeenCalledTimes(0);
    });

    it('should remove claims if public host role was removed', async () => {
      userUpdatedHandler(
        'some-user-id',
        {role: ROLE.publicHost},
        {role: undefined},
      );
      expect(mockUpdateRole).toHaveBeenCalledWith('some-user-id', null);
    });

    it('should not remove claims if public host was not updated', async () => {
      userUpdatedHandler(
        'some-user-id',
        {description: 'some description'},
        {description: 'some updated description'},
      );
      expect(mockUpdateRole).toHaveBeenCalledTimes(0);
    });
  });
});
