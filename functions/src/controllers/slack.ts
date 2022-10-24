import {getAuth} from 'firebase-admin/auth';
import {REQUEST_ACTION} from '../lib/constants/requestAction';
import {
  parseMessage,
  SlackPayload,
  updatePublicHostRequestMessage,
} from '../lib/slack';
import {generateVerificationCode} from '../lib/utils';
import {updatePublicHostRequest} from '../models/publicHostRequests';
import {SlackError} from './errors/SlackError';

const parseMessageOrThrow = (slackPayload: string) => {
  try {
    return parseMessage(JSON.parse(slackPayload) as SlackPayload);
  } catch (error) {
    throw new SlackError('could-not-parse-message', error);
  }
};

export const publicHostAction = async (slackPayload: string) => {
  const [channelId, ts, action_id, userId] = parseMessageOrThrow(slackPayload);

  const user = await getAuth().getUser(userId);

  if (!user?.email) {
    throw new SlackError('user-not-found');
  }

  if (action_id === REQUEST_ACTION.ACCEPT_PUBLIC_HOST_ROLE) {
    const verificationCode = generateVerificationCode();

    await updatePublicHostRequest(user.uid, 'accepted', verificationCode);

    await updatePublicHostRequestMessage(
      channelId,
      ts,
      user.email,
      verificationCode,
    );
  } else {
    await updatePublicHostRequest(user.uid, 'declined');
    await updatePublicHostRequestMessage(channelId, ts, user.email);
  }
};
