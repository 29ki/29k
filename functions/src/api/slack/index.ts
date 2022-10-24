import {cerateSlackRouter} from '../../lib/routers';
import {publicHostAction} from '../../controllers/slack';

const slackRouter = cerateSlackRouter();

slackRouter.post('/publicHostAction', async ctx => {
  try {
    await publicHostAction(ctx.request.body?.payload as string);
    ctx.status = 200;
  } catch (error) {
    console.error('Error handling slack action', error);
    ctx.status = 500;
  }
});

export {slackRouter};
