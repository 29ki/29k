import {Context, Next} from 'koa';
import {verifySlackRequest as verify} from '@slack/bolt';
import config from '../../lib/config';

const {SLACK_SIGNING_SECRET} = config;

export type SlackContext = Context & {
  headers: {'x-slack-signature': string; 'x-slack-request-timestamp': number};
  req: {rawBody: Buffer; body: Record<string, unknown>};
};

const verifySlackRequest = () => async (ctx: SlackContext, next: Next) => {
  const {headers, req} = ctx;

  verify({
    signingSecret: SLACK_SIGNING_SECRET,
    headers,
    body: req.rawBody.toString(),
  });

  await next();
};

export default verifySlackRequest;
