import {firestore} from 'firebase-admin';
import 'firebase-functions';
import {onRequest} from 'firebase-functions/v2/https';

import {createRoom} from '../lib/daily';

export type Temple = {
  id: string;
  name: string;
  url: string;
  active: boolean;
};

const TEMPLES_COLLECTION = 'temples';

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
        const snapshot = await firestore().collection(TEMPLES_COLLECTION).get();
        const temples = snapshot.docs.map(doc => doc.data()) as Temple[];

        response.status(200).json(temples);
      } catch (err) {
        console.error('Failed to query temples', err);
        response.status(500).send(err);
      }
    }

    if (request.method === 'POST') {
      try {
        const {name} = JSON.parse(request.body);
        const data = await createRoom(name);
        const temple: Temple = {
          id: data.id,
          name,
          url: data.url,
          active: false,
        };

        await firestore()
          .collection(TEMPLES_COLLECTION)
          .doc(data.id)
          .create(temple);

        response.status(200).json(data);
      } catch (err) {
        console.error('Failed to create temple', err);
        response.status(500).send(err);
      }
    }

    return;
  },
);
