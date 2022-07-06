import {onRequest} from 'firebase-functions/v2/https';

export const call = onRequest(
  {
    region: 'europe-west1',
    memory: '256MiB',
    maxInstances: 1024,
    minInstances: 1,
  },
  (request, response) => {
    response
      .status(200)
      .send('https://29k-testing.daily.co/I1s53jXePycRMHTAwcQC');
    return;
  },
);
