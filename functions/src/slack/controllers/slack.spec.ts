import {getAuth} from 'firebase-admin/auth';
import {updatePublicHostRequest} from '../../models/publicHostRequests';
import {createPublicHostCodeLink} from '../../models/dynamicLinks';
import {RequestAction} from '../../lib/constants/requestAction';
import {updatePublicHostRequestMessage, parseMessage} from '../../models/slack';
import {slackHandler} from './slack';
import {SlackError, SlackErrorCode} from '../../controllers/errors/SlackError';

jest.mock('../../models/slack');
jest.mock('../../models/publicHostRequests');
jest.mock('../../models/dynamicLinks');

const mockUpdatePublicHostRequestMessage =
  updatePublicHostRequestMessage as jest.Mock;
const mockParseMessage = parseMessage as jest.Mock;
const mockGetUser = getAuth().getUser as jest.Mock;
const mockUpdatePublicHostRequest = updatePublicHostRequest as jest.Mock;
const mockCreatePublicHostCodeLink = createPublicHostCodeLink as jest.Mock;

beforeEach(async () => {
  jest.clearAllMocks();
});

describe('slack', () => {
  describe('publicHostAction', () => {
    it('should update request to accepted and notify in slack', async () => {
      mockCreatePublicHostCodeLink.mockResolvedValueOnce(
        'http://some.deep/verification/link',
      );
      mockParseMessage.mockReturnValueOnce([
        'some-channel-id',
        'some-ts',
        RequestAction.ACCEPT_PUBLIC_HOST_ROLE,
        'some-user-id',
      ]);
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

    it('should update request to declined and notify in slack', async () => {
      mockParseMessage.mockReturnValueOnce([
        'some-channel-id',
        'some-ts',
        RequestAction.DECLINE_PUBLIC_HOST_ROLE,
        'some-user-id',
      ]);
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

    it('should throw if slack message is not valid json', async () => {
      mockGetUser.mockResolvedValueOnce({
        uid: 'some-user-id',
      });

      try {
        await slackHandler('invalid-json');
      } catch (error) {
        expect(error).toEqual(
          new SlackError(SlackErrorCode.couldNotParseMessage),
        );
      }

      expect(mockUpdatePublicHostRequest).toHaveBeenCalledTimes(0);
      expect(mockUpdatePublicHostRequestMessage).toHaveBeenCalledTimes(0);
    });

    it('should throw if slack message in expected format', async () => {
      mockParseMessage.mockImplementation(() => {
        throw new Error('error');
      });
      mockGetUser.mockResolvedValueOnce({
        uid: 'some-user-id',
      });

      try {
        await slackHandler(JSON.stringify({}));
      } catch (error) {
        expect(error).toEqual(
          new SlackError(SlackErrorCode.couldNotParseMessage),
        );
      }

      expect(mockUpdatePublicHostRequest).toHaveBeenCalledTimes(0);
      expect(mockUpdatePublicHostRequestMessage).toHaveBeenCalledTimes(0);
    });

    it('should throw if user has no email', async () => {
      mockParseMessage.mockReturnValueOnce([
        'some-channel-id',
        'some-ts',
        RequestAction.ACCEPT_PUBLIC_HOST_ROLE,
        'some-user-id',
      ]);
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
