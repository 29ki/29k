export const isAvailable = async () => false;

export const requestAuthorization = async () => false;

export const getAuthorizationStatus = async () => false;

export const log = async (start: Date, end?: Date) => {
  // Stupid hack to not get the "unused variable" warning
  start;
  end;
  return false;
};
