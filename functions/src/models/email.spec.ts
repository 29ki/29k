import sendgrid from '@sendgrid/mail';
import MockDate from 'mockdate';

import {sendReportEmail} from './email';
import {
  renderUserReportHtml,
  renderUserReportText,
} from '../lib/emailTemplates/report';

jest.mock('@sendgrid/mail');
jest.mock('../lib/emailTemplates/report');

const mockNow = new Date('2022-12-10T10:00:00');
MockDate.set(mockNow); // Date.now()

const sendMock = jest.mocked(sendgrid.send);
const renderUserReportHtmlMock = jest.mocked(renderUserReportHtml);
const renderUserReportTextMock = jest.mocked(renderUserReportText);

afterEach(() => {
  jest.clearAllMocks();
});

describe('email', () => {
  describe('sendReportEmail', () => {
    it('should call render methods with correct props and send with proper fields', async () => {
      renderUserReportHtmlMock.mockReturnValueOnce('email-html-code');
      renderUserReportTextMock.mockReturnValueOnce('email-plain-text');

      await sendReportEmail({
        text: 'some report text',
        language: 'en',
        params: {gitCommit: 'some commit hash'},
      });

      expect(sendMock).toHaveBeenCalledTimes(1);
      expect(sendMock).toHaveBeenCalledWith({
        categories: ['Report from user'],
        from: 'app@29k.org',
        html: 'email-html-code',
        subject: 'Your feedback to Aware - 10/12/2022',
        text: 'email-plain-text',
        to: 'help@29k.org',
      });
      expect(renderUserReportHtmlMock).toHaveBeenCalledTimes(1);
      expect(renderUserReportHtmlMock).toHaveBeenCalledWith({
        body: 'This message was sent from the Aware app:',
        content: 'some report text',
        params: {gitCommit: 'some commit hash'},
      });
      expect(renderUserReportTextMock).toHaveBeenCalledTimes(1);
      expect(renderUserReportTextMock).toHaveBeenCalledWith({
        body: 'This message was sent from the Aware app:',
        content: 'some report text',
        params: {gitCommit: 'some commit hash'},
      });
    });
  });
});
