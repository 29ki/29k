import {ROLE, UserData} from '../../../shared/src/types/User';
import {updateRole} from '../models/auth';

export const userUpdatedHandler = async (
  userId: string,
  dataBefore?: UserData,
  dataAfter?: UserData,
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
