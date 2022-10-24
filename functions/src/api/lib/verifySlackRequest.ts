import {Context, Next} from 'koa';
import {verifySlackRequest as verify} from '@slack/bolt';
import config from '../../lib/config';

const {FUNCTIONS_SLACK_SIGNING_SECRET} = config;

export type SlackAuthContext = Context & {
  headers: {'x-slack-signature': string; 'x-slack-request-timestamp': number};
  req: {rawBody: Buffer};
};

const verifySlackRequest = () => async (ctx: SlackAuthContext, next: Next) => {
  const {headers, req} = ctx;

  verify({
    signingSecret: FUNCTIONS_SLACK_SIGNING_SECRET,
    headers,
    body: req.rawBody.toString(),
  });

  await next();
};

export default verifySlackRequest;
