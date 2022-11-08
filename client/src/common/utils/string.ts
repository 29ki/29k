export const formatInviteCode = (code: number) =>
  (code.toString().match(/\d{1,3}/g) ?? []).join(' ');
