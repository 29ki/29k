import * as yup from 'yup';
import validator from 'koa-yup-validator';
import {firestore} from 'firebase-admin';
import 'firebase-functions';

import {Temple} from '../../../../shared/src/types/Temple';
import * as dailyApi from '../../lib/dailyApi';
import {createAuthorizedRouter} from '../../lib/routers';

const TEMPLES_COLLECTION = 'temples';

const templesRouter = createAuthorizedRouter();

templesRouter.get('/', async ctx => {
  const {response} = ctx;

  const snapshot = await firestore().collection(TEMPLES_COLLECTION).get();
  const temples = snapshot.docs.map(doc => doc.data()) as Temple[];

  response.status = 200;
  ctx.body = temples;
});

const CreateTempleSchema = yup.object().shape({
  name: yup.string().required(),
  contentId: yup.string().required(),
});

type CreateTemple = yup.InferType<typeof CreateTempleSchema>;

templesRouter.post('/', validator({body: CreateTempleSchema}), async ctx => {
  const {name, contentId} = ctx.request.body as CreateTemple;

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

const UpdateTempleSchema = yup
  .object({
    active: yup.boolean(),
    index: yup.number(),
    playing: yup.boolean(),
    dailySpotlightId: yup.string(),
  })
  .test(
    'nonEmptyObject',
    'object may not be empty',
    test => Object.keys(test).length > 0,
  );

type UpdateTemple = yup.InferType<typeof UpdateTempleSchema>;

templesRouter.put('/:id', validator({body: UpdateTempleSchema}), async ctx => {
  const data = ctx.request.body as UpdateTemple;
  const {id} = ctx.params;
  const templeDocRef = firestore().collection(TEMPLES_COLLECTION).doc(id);
  const templeDoc = await templeDocRef.get();

  if (templeDoc.exists) {
    const temple = templeDoc.data() as Temple;

    if (ctx.user.id !== temple.facilitator) {
      ctx.status = 500;
      return;
    }

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
