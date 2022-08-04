import {firestore} from 'firebase-admin';
import 'firebase-functions';
import {onRequest} from 'firebase-functions/v2/https';
import {createRoom, getRooms} from '../lib/daily';

export const room = onRequest(
  {
    region: 'europe-west1',
    memory: '256MiB',
    maxInstances: 1024,
    minInstances: 1,
  },
  async (request, response) => {
    if (request.method === 'GET') {
      try {
        const rooms = await getRooms();
        response.status(200).json(rooms);
      } catch (err) {
        console.error('Failed to create room', err);
        response.status(500).send(err);
      }
    }

    if (request.method === 'POST') {
      try {
        const data = await createRoom(request.body.name);
        await firestore()
          .collection('live-content-sessions')
          .doc()
          .create({roomUrl: data.url, roomId: data.id, active: false});

        response.status(200).json(data);
      } catch (err) {
        console.error('Failed to create room', err);
        response.status(500).send(err);
      }
    }

    return;
  },
);
