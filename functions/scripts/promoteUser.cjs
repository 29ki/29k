const admin = require('firebase-admin');

const setup = () => {
  const {GOOGLE_APPLICATION_CREDENTIALS, FIREBASE_AUTH_EMULATOR_HOST} =
    process.env;

  if (!GOOGLE_APPLICATION_CREDENTIALS && !FIREBASE_AUTH_EMULATOR_HOST) {
    console.error(
      'GOOGLE_APPLICATION_CREDENTIALS env pointing to service-account.json is required or FIREBASE_AUTH_EMULATOR_HOST pointing to localhost:9099',
    );
    process.exit(1);
  }

  if (FIREBASE_AUTH_EMULATOR_HOST) {
    admin.initializeApp({projectId: 'demo-29k-cupcake'});
  } else {
    admin.initializeApp();
  }

  return {auth: admin.auth()};
};

const main = async () => {
  const {auth} = setup();

  const promoteUser = userId => {
    // auth.setCustomUserClaims(userId, null);
    auth.setCustomUserClaims(userId, {role: 'publicHost'});
  };

  const result = await auth.getUsers([{email: 'emil6@29k.org'}]);
  Promise.all(result.users.map(user => promoteUser(user.uid)));

  const result2 = await auth.getUsers([{email: 'emil6@29k.org'}]);
  console.log(result2);
};

main();
