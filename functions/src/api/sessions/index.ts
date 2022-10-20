import * as yup from 'yup';
import validator from 'koa-yup-validator';
import {firestore} from 'firebase-admin';
import {Timestamp} from 'firebase-admin/firestore';
import 'firebase-functions';

import {
  SessionInput,
  SessionData,
  Session,
  ExerciseStateData,
  ExerciseState,
} from '../../../../shared/src/types/Session';
import * as dailyApi from '../../lib/dailyApi';
import {createRouter} from '../../lib/routers';
import {getData, removeEmpty} from '../../lib/utils';
import dayjs from 'dayjs';

const getSessionExerciseState = (
  exerciseState: ExerciseStateData,
): ExerciseState => ({
  ...exerciseState,
  timestamp: exerciseState.timestamp.toDate().toISOString(),
});

const getSession = (session: SessionData): Session => ({
  ...session,
  exerciseState: getSessionExerciseState(session.exerciseState),
  startTime: session.startTime.toDate().toISOString(),
});

const SESSIONS_COLLECTION = 'sessions';

const sessionsRouter = createRouter();

sessionsRouter.get('/', async ctx => {
  const {response} = ctx;

  const snapshot = await firestore()
    .collection(SESSIONS_COLLECTION)
    .where('ended', '==', false)
    .where(
      'startTime',
      '>',
      Timestamp.fromDate(
        dayjs(Timestamp.now().toDate()).subtract(30, 'minute').toDate(),
      ),
    )
    .orderBy('startTime', 'asc')
    .get();
  const sessions = snapshot.docs.map(doc =>
    getSession(getData<SessionData>(doc)),
  );

  response.status = 200;
  ctx.body = sessions;
});

const CreateSessionSchema = yup.object().shape({
  contentId: yup.string().required(),
  startTime: yup.string().required(),
});

type CreateSession = yup.InferType<typeof CreateSessionSchema>;

sessionsRouter.post('/', validator({body: CreateSessionSchema}), async ctx => {
  const {contentId, startTime} = ctx.request.body as CreateSession;

  const startDateTime = dayjs(startTime);

  const data = await dailyApi.createRoom(startDateTime.add(2, 'hour'));
  const defaultExerciseState = {
    index: 0,
    playing: false,
    timestamp: Timestamp.now(),
  };

  const session: SessionInput & {
    dailyRoomName: string;
  } = {
    id: data.id,
    url: data.url,
    contentId,
    facilitator: ctx.user.id,
    dailyRoomName: data.name,
    startTime: Timestamp.fromDate(startDateTime.toDate()),
    exerciseState: defaultExerciseState,
    started: false,
    ended: false,
  };

  await firestore().collection(SESSIONS_COLLECTION).doc(data.id).set(session);

  ctx.body = getSession(session);
});

sessionsRouter.delete('/:id', async ctx => {
  const {id} = ctx.params;
  const sessionDocRef = firestore().collection(SESSIONS_COLLECTION).doc(id);
  const session = getData<
    SessionData & {
      dailyRoomName: string;
    }
  >(await sessionDocRef.get());

  if (ctx.user.id !== session?.facilitator) {
    ctx.status = 500;
    return;
  }

  try {
    await Promise.all([
      dailyApi.deleteRoom(session.dailyRoomName),
      sessionDocRef.delete(),
    ]);
  } catch {
    ctx.status = 500;
  }

  ctx.status = 200;
  ctx.body = 'Session deleted successfully';
});

const UpdateSessionSchema = yup
  .object({
    started: yup.boolean(),
    ended: yup.boolean(),
  })
  .test(
    'nonEmptyObject',
    'object may not be empty',
    test => Object.keys(test).length > 0,
  );

type UpdateSession = yup.InferType<typeof UpdateSessionSchema>;

sessionsRouter.put(
  '/:id',
  validator({body: UpdateSessionSchema}),
  async ctx => {
    const {id} = ctx.params;
    const body = ctx.request.body as UpdateSession;
    const sessionDocRef = firestore().collection(SESSIONS_COLLECTION).doc(id);
    const session = getData<SessionData>(await sessionDocRef.get());

    if (ctx.user.id !== session?.facilitator) {
      ctx.status = 500;
      throw new Error('Unauthorized');
    }

    await sessionDocRef.update(removeEmpty(body));

    ctx.status = 200;
    ctx.body = getSession(getData<SessionData>(await sessionDocRef.get()));
  },
);

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

sessionsRouter.put(
  '/:id/exerciseState',
  validator({body: ExerciseStateUpdateSchema}),
  async ctx => {
    const {id} = ctx.params;
    const sessionDocRef = firestore().collection(SESSIONS_COLLECTION).doc(id);

    await firestore().runTransaction(async transaction => {
      const sessionDoc = await transaction.get(sessionDocRef);

      if (sessionDoc.exists) {
        const session = getData<SessionData>(sessionDoc);

        if (session && ctx.user.id !== session?.facilitator) {
          ctx.status = 500;
          throw new Error('Unauthorized');
        }

        const update = removeEmpty(ctx.request.body as ExerciseStateUpdate);

        const data = removeEmpty({
          ...session.exerciseState,
          ...update,
          timestamp: Timestamp.now(),
        });

        await transaction.update(sessionDocRef, {exerciseState: data});
      } else {
        ctx.status = 500;
      }
    });

    ctx.body = getSession(getData<SessionData>(await sessionDocRef.get()));
  },
);

export {sessionsRouter};
