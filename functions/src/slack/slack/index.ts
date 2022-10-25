import {createSlackRouter} from '../../lib/routers';
import {slackHandler} from '../controllers/slack';

const slackRouter = createSlackRouter();

slackRouter.post('/', async ctx => {
  try {
    await slackHandler(ctx.req.body?.payload as string);
    ctx.status = 200;
  } catch (error) {
    console.error('Error handling slack action', error);
    ctx.status = 500;
  }
});

export {slackRouter};
