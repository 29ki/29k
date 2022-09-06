import Router from '@koa/router';
import * as yup from 'yup';
import validator from 'koa-yup-validator';
import {firestore} from 'firebase-admin';
import 'firebase-functions';

import {Temple} from '../../../../shared/src/types/Temple';
import * as dailyApi from '../../lib/dailyApi';
import {DefaultState} from 'koa';
import {FirebaseAuthContext} from '../lib/firebaseAuth';

const TEMPLES_COLLECTION = 'temples';

const templesRouter = new Router<DefaultState, FirebaseAuthContext>();

templesRouter.get('/', async ctx => {
  const {response} = ctx;

  const snapshot = await firestore().collection(TEMPLES_COLLECTION).get();
  const temples = snapshot.docs.map(doc => doc.data()) as Temple[];

  response.status = 200;
  ctx.body = temples;
});

const CreateTempleData = yup.object().shape({
  name: yup.string().required(),
  contentId: yup.string().required(),
});

templesRouter.post('/', validator({body: CreateTempleData}), async ctx => {
  const {name, contentId} = ctx.request.body;

  const data = await dailyApi.createRoom();
  const temple: Temple & {dailyRoomName: string} = {
    id: data.id,
    name,
    url: data.url,
    active: false,
    index: 0,
    playing: false,
    contentId,
    facilitator: ctx.user.id,
    dailyRoomName: data.name,
  };

  await firestore().collection(TEMPLES_COLLECTION).doc(data.id).set(temple);

  ctx.body = temple;
});

const UpdateTemple = yup
  .object({
    active: yup.boolean(),
    index: yup.number(),
    playing: yup.boolean(),
  })
  .test(
    'nonEmptyObject',
    'object may not be empty',
    test => Object.keys(test).length > 0,
  );

templesRouter.put('/:id', validator({body: UpdateTemple}), async ctx => {
  const data = ctx.request.body;
  const {id} = ctx.params;
  const templeDocRef = firestore().collection(TEMPLES_COLLECTION).doc(id);

  const templeDoc = await templeDocRef.get();
  if (templeDoc.exists) {
    await templeDocRef.update(data);

    ctx.body = (await templeDocRef.get()).data();
  } else {
    ctx.status = 500;
  }
});

templesRouter.delete('/:id', async ctx => {
  const {id} = ctx.params;
  const templeDocRef = firestore().collection(TEMPLES_COLLECTION).doc(id);
  const temple = (await templeDocRef.get()).data() as Temple & {
    dailyRoomName: string;
  };

  if (ctx.user.id !== temple.facilitator) {
    ctx.status = 500;
    return;
  }

  try {
    await Promise.all([
      dailyApi.deleteRoom(temple.dailyRoomName),
      templeDocRef.delete(),
    ]);
  } catch {
    ctx.status = 500;
  }

  ctx.status = 200;
  ctx.body = 'Temple deleted successfully';
});

export {templesRouter};
