import {getAuth} from 'firebase-admin/auth';
import {SlackError, SlackErrorCode} from '../../controllers/errors/SlackError';
import {RequestAction} from '../../lib/constants/requestAction';
import {
  parseMessage,
  SlackPayload,
  updatePublicHostRequestMessage,
} from '../../models/slack';
import {generateVerificationCode} from '../../lib/utils';
import {createPublicHostCodeLink} from '../../models/dynamicLinks';
import {updatePublicHostRequest} from '../../models/publicHostRequests';

const parseMessageOrThrow = (slackPayload: string) => {
  try {
    return parseMessage(JSON.parse(slackPayload) as SlackPayload);
  } catch (error) {
    throw new SlackError(SlackErrorCode.couldNotParseMessage, error);
  }
};

export const slackHandler = async (slackPayload: string) => {
  const [channelId, ts, action_id, userId] = parseMessageOrThrow(slackPayload);

  const user = await getAuth().getUser(userId);

  if (!user?.email) {
    throw new SlackError(SlackErrorCode.userNotFound);
  }

  if (action_id === RequestAction.ACCEPT_PUBLIC_HOST_ROLE) {
    const verificationCode = generateVerificationCode();

    await updatePublicHostRequest(user.uid, 'accepted', verificationCode);

    const link = await createPublicHostCodeLink(verificationCode);

    await updatePublicHostRequestMessage(
      channelId,
      ts,
      user.email,
      link,
      verificationCode,
    );
  } else {
    await updatePublicHostRequest(user.uid, 'declined');
    await updatePublicHostRequestMessage(channelId, ts, user.email);
  }
};
