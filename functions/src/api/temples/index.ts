import * as yup from 'yup';
import validator from 'koa-yup-validator';
import {firestore} from 'firebase-admin';
import {Timestamp} from 'firebase-admin/firestore';
import 'firebase-functions';

import {
  TempleInput,
  TempleData,
  Temple,
  ExerciseStateData,
  ExerciseState,
} from '../../../../shared/src/types/Temple';
import * as dailyApi from '../../lib/dailyApi';
import {createRouter} from '../../lib/routers';

const getTempleExerciseState = (
  exerciseState: ExerciseStateData,
): ExerciseState => ({
  ...exerciseState,
  timestamp: exerciseState.timestamp.toDate().toISOString(),
});

const getTemple = (temple: TempleData): Temple => ({
  ...temple,
  exerciseState: getTempleExerciseState(temple.exerciseState),
  startTime: temple.startTime.toDate().toISOString(),
});

const TEMPLES_COLLECTION = 'temples';

const templesRouter = createRouter();

templesRouter.get('/', async ctx => {
  const {response} = ctx;

  const snapshot = await firestore().collection(TEMPLES_COLLECTION).get();
  const temples = snapshot.docs.map(doc => getTemple(doc.data() as TempleData));

  response.status = 200;
  ctx.body = temples;
});

const CreateTempleSchema = yup.object().shape({
  name: yup.string().required(),
  contentId: yup.string().required(),
  startTime: yup.string().required(),
});

type CreateTemple = yup.InferType<typeof CreateTempleSchema>;

templesRouter.post('/', validator({body: CreateTempleSchema}), async ctx => {
  const {name, contentId, startTime} = ctx.request.body as CreateTemple;

  const data = await dailyApi.createRoom();
  const defaultExerciseState = {
    index: 0,
    playing: false,
    timestamp: Timestamp.now(),
  };

  const temple: TempleInput & {
    dailyRoomName: string;
  } = {
    id: data.id,
    name: name,
    url: data.url,
    contentId,
    facilitator: ctx.user.id,
    dailyRoomName: data.name,
    startTime: Timestamp.fromDate(new Date(startTime)),
    exerciseState: defaultExerciseState,
    started: false,
  };

  await firestore().collection(TEMPLES_COLLECTION).doc(data.id).set(temple);

  ctx.body = getTemple(temple);
});

templesRouter.delete('/:id', async ctx => {
  const {id} = ctx.params;
  const templeDocRef = firestore().collection(TEMPLES_COLLECTION).doc(id);
  const temple = (await templeDocRef.get()).data() as TempleData & {
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

const UpdateTempleSchema = yup
  .object({
    started: yup.boolean(),
  })
  .test(
    'nonEmptyObject',
    'object may not be empty',
    test => Object.keys(test).length > 0,
  );

type UpdateTemple = yup.InferType<typeof UpdateTempleSchema>;

templesRouter.put('/:id', validator({body: UpdateTempleSchema}), async ctx => {
  const {id} = ctx.params;
  const body = ctx.request.body as UpdateTemple;
  const templeDocRef = firestore().collection(TEMPLES_COLLECTION).doc(id);
  const temple = (await templeDocRef.get()).data() as TempleData;

  if (ctx.user.id !== temple.facilitator) {
    ctx.status = 500;
    throw new Error('Unauthorized');
  }

  await templeDocRef.update(body);

  ctx.status = 200;
  ctx.body = getTemple((await templeDocRef.get()).data() as TempleData);
});

const ExerciseStateUpdateSchema = yup
  .object({
    index: yup.number(),
    playing: yup.boolean(),
    dailySpotlightId: yup.string(),
  })
  .test(
    'nonEmptyObject',
    'object may not be empty',
    test => Object.keys(test).length > 0,
  );

type ExerciseStateUpdate = yup.InferType<typeof ExerciseStateUpdateSchema>;

templesRouter.put(
  '/:id/exerciseState',
  validator({body: ExerciseStateUpdateSchema}),
  async ctx => {
    const {id} = ctx.params;
    const templeDocRef = firestore().collection(TEMPLES_COLLECTION).doc(id);

    await firestore().runTransaction(async transaction => {
      const templeDoc = await transaction.get(templeDocRef);

      if (templeDoc.exists) {
        const temple = templeDoc.data() as TempleData;

        if (ctx.user.id !== temple.facilitator) {
          ctx.status = 500;
          throw new Error('Unauthorized');
        }

        const data = {
          ...temple.exerciseState,
          ...(ctx.request.body as ExerciseStateUpdate),
          timestamp: Timestamp.now(),
        };

        await transaction.update(templeDocRef, {exerciseState: data});
      } else {
        ctx.status = 500;
      }
    });

    ctx.body = getTemple((await templeDocRef.get()).data() as TempleData);
  },
);

export {templesRouter};
