import {getAuth} from 'firebase-admin/auth';
import {updatePublicHostRequest} from '../../models/publicHostRequests';
import {createPublicHostCodeLink} from '../../models/dynamicLinks';
import {updatePost} from '../../models/post';
import {RequestAction} from '../../lib/constants/requestAction';
import {
  updatePublicHostRequestMessage,
  updatePostMessageVisibility,
  parseMessage,
} from '../../models/slack';
import {slackHandler} from './slack';
import {SlackError, SlackErrorCode} from '../../controllers/errors/SlackError';

jest.mock('../../models/slack');
jest.mock('../../models/publicHostRequests');
jest.mock('../../models/dynamicLinks');
jest.mock('../../models/post');

const mockUpdatePublicHostRequestMessage = jest.mocked(
  updatePublicHostRequestMessage,
);
const mockParseMessage = jest.mocked(parseMessage);
const mockGetUser = getAuth().getUser as jest.Mock;
const mockUpdatePublicHostRequest = jest.mocked(updatePublicHostRequest);
const mockCreatePublicHostCodeLink = jest.mocked(createPublicHostCodeLink);
const mockUpdatePostMessageVisibility = jest.mocked(
  updatePostMessageVisibility,
);
const mockUpdatePost = jest.mocked(updatePost);

beforeEach(async () => {
  jest.clearAllMocks();
});

describe('slack', () => {
  it('should throw if slack message is not valid json', async () => {
    try {
      await slackHandler('invalid-json');
    } catch (error) {
      expect(error).toEqual(
        new SlackError(SlackErrorCode.couldNotParseMessage),
      );
    }

    expect(mockUpdatePost).toHaveBeenCalledTimes(0);
    expect(mockUpdatePostMessageVisibility).toHaveBeenCalledTimes(0);
    expect(mockUpdatePublicHostRequest).toHaveBeenCalledTimes(0);
    expect(mockUpdatePublicHostRequestMessage).toHaveBeenCalledTimes(0);
  });

  it('should throw if slack message in expected format', async () => {
    mockParseMessage.mockImplementation(() => {
      throw new Error('error');
    });

    try {
      await slackHandler(JSON.stringify({}));
    } catch (error) {
      expect(error).toEqual(
        new SlackError(SlackErrorCode.couldNotParseMessage),
      );
    }

    expect(mockUpdatePost).toHaveBeenCalledTimes(0);
    expect(mockUpdatePostMessageVisibility).toHaveBeenCalledTimes(0);
    expect(mockUpdatePublicHostRequest).toHaveBeenCalledTimes(0);
    expect(mockUpdatePublicHostRequestMessage).toHaveBeenCalledTimes(0);
  });

  describe('hideSharingPost', () => {
    it('should update post and send message', async () => {
      mockParseMessage.mockReturnValueOnce({
        channelId: 'some-channel-id',
        ts: 'some-ts',
        actionId: RequestAction.HIDE_SHARING_POST,
        value: 'some-post-id',
        originalBlocks: [],
      });

      await slackHandler(JSON.stringify({}));

      expect(mockUpdatePost).toHaveBeenCalledTimes(1);
      expect(mockUpdatePost).toHaveBeenCalledWith('some-post-id', {
        approved: false,
      });
      expect(mockUpdatePostMessageVisibility).toHaveBeenCalledTimes(1);
      expect(mockUpdatePostMessageVisibility).toHaveBeenCalledWith(
        'some-channel-id',
        'some-ts',
        'some-post-id',
        [],
        false,
      );
    });
  });

  describe('showSharingPost', () => {
    it('should update post and send message', async () => {
      mockParseMessage.mockReturnValueOnce({
        channelId: 'some-channel-id',
        ts: 'some-ts',
        actionId: RequestAction.SHOW_SHARING_POST,
        value: 'some-post-id',
        originalBlocks: [],
      });

      await slackHandler(JSON.stringify({}));

      expect(mockUpdatePost).toHaveBeenCalledTimes(1);
      expect(mockUpdatePost).toHaveBeenCalledWith('some-post-id', {
        approved: true,
      });
      expect(updatePostMessageVisibility).toHaveBeenCalledTimes(1);
      expect(updatePostMessageVisibility).toHaveBeenCalledWith(
        'some-channel-id',
        'some-ts',
        'some-post-id',
        [],
        true,
      );
    });
  });

  describe('acceptPublicHostRole', () => {
    it('should update request to accepted and notify in slack', async () => {
      mockCreatePublicHostCodeLink.mockResolvedValueOnce(
        'http://some.deep/verification/link',
      );
      mockParseMessage.mockReturnValueOnce({
        channelId: 'some-channel-id',
        ts: 'some-ts',
        actionId: RequestAction.ACCEPT_PUBLIC_HOST_ROLE,
        value: 'some-user-id',
        originalBlocks: [],
      });
      mockGetUser.mockResolvedValueOnce({
        email: 'some@email.com',
        uid: 'some-user-id',
      });

      await slackHandler(JSON.stringify({payload: 'some-payload'}));

      expect(mockUpdatePublicHostRequest).toHaveBeenLastCalledWith(
        'some-user-id',
        'accepted',
        expect.any(Number),
      );

      expect(mockUpdatePublicHostRequestMessage).toHaveBeenCalledWith(
        'some-channel-id',
        'some-ts',
        'some@email.com',
        'http://some.deep/verification/link',
        expect.any(Number),
      );
    });

    it('should throw if user has no email', async () => {
      mockParseMessage.mockReturnValueOnce({
        channelId: 'some-channel-id',
        ts: 'some-ts',
        actionId: RequestAction.ACCEPT_PUBLIC_HOST_ROLE,
        value: 'some-user-id',
        originalBlocks: [],
      });
      mockGetUser.mockResolvedValueOnce({
        uid: 'some-user-id',
      });

      try {
        await slackHandler(JSON.stringify({payload: 'some-payload'}));
      } catch (error) {
        expect(error).toEqual(new SlackError(SlackErrorCode.userNotFound));
      }

      expect(mockUpdatePublicHostRequest).toHaveBeenCalledTimes(0);
      expect(mockUpdatePublicHostRequestMessage).toHaveBeenCalledTimes(0);
    });
  });

  describe('declinePublicHostRole', () => {
    it('should update request to declined and notify in slack', async () => {
      mockParseMessage.mockReturnValueOnce({
        channelId: 'some-channel-id',
        ts: 'some-ts',
        actionId: RequestAction.DECLINE_PUBLIC_HOST_ROLE,
        value: 'some-user-id',
        originalBlocks: [],
      });
      mockGetUser.mockResolvedValueOnce({
        email: 'some@email.com',
        uid: 'some-user-id',
      });

      await slackHandler(JSON.stringify({payload: 'some-payload'}));

      expect(mockUpdatePublicHostRequest).toHaveBeenLastCalledWith(
        'some-user-id',
        'declined',
      );

      expect(mockUpdatePublicHostRequestMessage).toHaveBeenCalledWith(
        'some-channel-id',
        'some-ts',
        'some@email.com',
      );
    });

    it('should throw if user has no email', async () => {
      mockParseMessage.mockReturnValueOnce({
        channelId: 'some-channel-id',
        ts: 'some-ts',
        actionId: RequestAction.DECLINE_PUBLIC_HOST_ROLE,
        value: 'some-user-id',
        originalBlocks: [],
      });
      mockGetUser.mockResolvedValueOnce({
        uid: 'some-user-id',
      });

      try {
        await slackHandler(JSON.stringify({payload: 'some-payload'}));
      } catch (error) {
        expect(error).toEqual(new SlackError(SlackErrorCode.userNotFound));
      }

      expect(mockUpdatePublicHostRequest).toHaveBeenCalledTimes(0);
      expect(mockUpdatePublicHostRequestMessage).toHaveBeenCalledTimes(0);
    });
  });
});
