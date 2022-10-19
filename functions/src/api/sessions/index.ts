import * as yup from 'yup';
import validator from 'koa-yup-validator';
import 'firebase-functions';
import dayjs from 'dayjs';

import {Session, SessionType} from '../../../../shared/src/types/Session';
import * as dailyApi from '../../lib/dailyApi';
import {createRouter} from '../../lib/routers';

import {removeEmpty} from '../../lib/utils';
import {createDynamicLink} from '../../lib/dynamicLinks';
import {
  addSession,
  deleteSession,
  getSessionById,
  getSessions,
  updateExerciseState,
  updateSession,
} from '../../models/session';

const sessionsRouter = createRouter();

sessionsRouter.get('/', async ctx => {
  const {response} = ctx;

  const sessions = await getSessions();

  response.status = 200;
  ctx.body = sessions;
});

const CreateSessionSchema = yup.object().shape({
  contentId: yup.string().required(),
  type: yup.mixed<SessionType>().oneOf(Object.values(SessionType)).required(),
  startTime: yup.string().required(),
});

type CreateSession = yup.InferType<typeof CreateSessionSchema>;

sessionsRouter.post('/', validator({body: CreateSessionSchema}), async ctx => {
  const {contentId, type, startTime} = ctx.request.body as CreateSession;
  const user = ctx.user;

  const dailyRoom = await dailyApi.createRoom(dayjs(startTime).add(2, 'hour'));
  const link = await createDynamicLink(`sessions/${dailyRoom.id}`);

  const session = await addSession({
    id: dailyRoom.id,
    dailyRoomName: dailyRoom.name,
    url: dailyRoom.url,
    contentId,
    link,
    type,
    startTime,
    facilitator: user.id,
  });

  ctx.body = session;
});

sessionsRouter.delete('/:id', async ctx => {
  const {id} = ctx.params;

  const session = (await getSessionById(id)) as Session & {
    dailyRoomName: string;
  };

  if (ctx.user.id !== session?.facilitator) {
    ctx.status = 500;
    return;
  }

  try {
    await Promise.all([
      dailyApi.deleteRoom(session.dailyRoomName),
      deleteSession(session.id),
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
    const session = await getSessionById(id);

    if (ctx.user.id !== session?.facilitator) {
      ctx.status = 500;
      throw new Error('Unauthorized');
    }

    const updatedSession = await updateSession(id, removeEmpty(body));

    ctx.status = 200;
    ctx.body = updatedSession;
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

export type ExerciseStateUpdate = yup.InferType<
  typeof ExerciseStateUpdateSchema
>;

sessionsRouter.put(
  '/:id/exerciseState',
  validator({body: ExerciseStateUpdateSchema}),
  async ctx => {
    const {id} = ctx.params;
    const session = await getSessionById(id);

    if (!session) {
      ctx.status = 500;
    } else {
      if (ctx.user.id !== session?.facilitator) {
        ctx.status = 500;
        throw new Error('Unauthorized');
      }
      const data = removeEmpty(ctx.request.body as ExerciseStateUpdate);

      const updatedSession = await updateExerciseState(id, data);
      ctx.body = updatedSession;
    }
  },
);

export {sessionsRouter};
