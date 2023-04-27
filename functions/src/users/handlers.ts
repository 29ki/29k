import {ROLE, UserDataType} from '../../../shared/src/schemas/User';
import {updateRole} from '../models/auth';

export const userUpdatedHandler = async (
  userId: string,
  dataBefore?: UserDataType,
  dataAfter?: UserDataType,
) => {
  if (
    dataBefore?.role !== ROLE.publicHost &&
    dataAfter?.role === ROLE.publicHost
  ) {
    await updateRole(userId, ROLE.publicHost);
  } else if (
    dataBefore?.role === ROLE.publicHost &&
    dataAfter?.role !== ROLE.publicHost
  ) {
    await updateRole(userId, null);
  }
};
