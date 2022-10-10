import * as yup from 'yup';
import validator from 'koa-yup-validator';
import {firestore} from 'firebase-admin';
import {
  DocumentData,
  DocumentSnapshot,
  Timestamp,
} from 'firebase-admin/firestore';
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
import {removeEmpty} from '../../lib/utils';

const getData = <T>(document: DocumentSnapshot<DocumentData>) => {
  const data = document.data();
  return data as T;
};

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
  const temples = snapshot.docs.map(doc => getTemple(getData<TempleData>(doc)));

  response.status = 200;
  ctx.body = temples;
});

const CreateTempleSchema = yup.object().shape({
  contentId: yup.string().required(),
  startTime: yup.string().required(),
});

type CreateTemple = yup.InferType<typeof CreateTempleSchema>;

templesRouter.post('/', validator({body: CreateTempleSchema}), async ctx => {
  const {contentId, startTime} = ctx.request.body as CreateTemple;

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
    url: data.url,
    contentId,
    facilitator: ctx.user.id,
    dailyRoomName: data.name,
    startTime: Timestamp.fromDate(new Date(startTime)),
    exerciseState: defaultExerciseState,
    started: false,
    ended: false,
  };

  await firestore().collection(TEMPLES_COLLECTION).doc(data.id).set(temple);

  ctx.body = getTemple(temple);
});

templesRouter.delete('/:id', async ctx => {
  const {id} = ctx.params;
  const templeDocRef = firestore().collection(TEMPLES_COLLECTION).doc(id);
  const temple = getData<
    TempleData & {
      dailyRoomName: string;
    }
  >(await templeDocRef.get());

  if (ctx.user.id !== temple?.facilitator) {
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
    ended: yup.boolean(),
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
  const temple = getData<TempleData>(await templeDocRef.get());

  if (ctx.user.id !== temple?.facilitator) {
    ctx.status = 500;
    throw new Error('Unauthorized');
  }

  await templeDocRef.update(removeEmpty(body));

  ctx.status = 200;
  ctx.body = getTemple(getData<TempleData>(await templeDocRef.get()));
});

const ExerciseStateUpdateSchema = yup
  .object({
    index: yup.number(),
    playing: yup.boolean(),
    dailySpotlightId: yup.string(),
    ended: yup.boolean(),
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
        const temple = getData<TempleData>(templeDoc);

        if (temple && ctx.user.id !== temple?.facilitator) {
          ctx.status = 500;
          throw new Error('Unauthorized');
        }

        const update = removeEmpty(ctx.request.body as ExerciseStateUpdate);

        const data = removeEmpty({
          ...temple.exerciseState,
          ...update,
          timestamp: Timestamp.now(),
        });

        await transaction.update(templeDocRef, {exerciseState: data});
      } else {
        ctx.status = 500;
      }
    });

    ctx.body = getTemple(getData<TempleData>(await templeDocRef.get()));
  },
);

export {templesRouter};
