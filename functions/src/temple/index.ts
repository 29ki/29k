import {firestore} from 'firebase-admin';
import 'firebase-functions';
import {onRequest} from 'firebase-functions/v2/https';

import {createRoom} from '../lib/daily';

const FIRESTORE_COLLECTION = 'temples';

export const temple = onRequest(
  {
    region: 'europe-west1',
    memory: '256MiB',
    maxInstances: 1024,
    minInstances: 1,
  },
  async (request, response) => {
    if (request.method === 'GET') {
      try {
        const temples = await firestore()
          .collection(FIRESTORE_COLLECTION)
          .get();

        response.status(200).json(temples.docs.map(doc => doc.data()));
      } catch (err) {
        console.error('Failed to query temples', err);
        response.status(500).send(err);
      }
    }

    if (request.method === 'POST') {
      try {
        const {name} = JSON.parse(request.body);
        const data = await createRoom(name);

        await firestore().collection(FIRESTORE_COLLECTION).doc(data.id).create({
          id: data.id,
          name,
          url: data.url,
          active: false,
        });

        response.status(200).json(data);
      } catch (err) {
        console.error('Failed to create temple', err);
        response.status(500).send(err);
      }
    }

    return;
  },
);
