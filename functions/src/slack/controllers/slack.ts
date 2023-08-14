import {getAuth} from 'firebase-admin/auth';
import {SlackError, SlackErrorCode} from '../../controllers/errors/SlackError';
import {RequestAction} from '../../lib/constants/requestAction';
import {
  parseMessage,
  SlackPayload,
  updatePostMessageVisibility,
  updatePublicHostRequestMessage,
} from '../../models/slack';
import {generateVerificationCode} from '../../lib/utils';
import {createPublicHostCodeLink} from '../../models/dynamicLinks';
import {updatePublicHostRequest} from '../../models/publicHostRequests';
import {updatePost} from '../../models/post';

const parseMessageOrThrow = (slackPayload: string) => {
  try {
    return parseMessage(JSON.parse(slackPayload) as SlackPayload);
  } catch (error) {
    throw new SlackError(SlackErrorCode.couldNotParseMessage, error);
  }
};

export const slackHandler = async (slackPayload: string) => {
  const {channelId, ts, actionId, value, originalBlocks} =
    parseMessageOrThrow(slackPayload);

  if (actionId === RequestAction.HIDE_SHARING_POST) {
    await updatePost(value, {approved: false});
    await updatePostMessageVisibility(
      channelId,
      ts,
      value,
      originalBlocks,
      false,
    );
    return;
  }

  if (actionId === RequestAction.SHOW_SHARING_POST) {
    await updatePost(value, {approved: true});
    await updatePostMessageVisibility(
      channelId,
      ts,
      value,
      originalBlocks,
      true,
    );
    return;
  }

  const user = await getAuth().getUser(value);

  if (!user?.email) {
    throw new SlackError(SlackErrorCode.userNotFound);
  }

  if (actionId === RequestAction.ACCEPT_PUBLIC_HOST_ROLE) {
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
  } else if (actionId === RequestAction.DECLINE_PUBLIC_HOST_ROLE) {
    await updatePublicHostRequest(user.uid, 'declined');
    await updatePublicHostRequestMessage(channelId, ts, user.email);
  }
};
