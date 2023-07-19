const mockOpenAi = {
  createChatCompletion: jest.fn(),
};

jest.mock('openai', () => ({
  Configuration: jest.fn(),
  OpenAIApi: jest.fn(() => mockOpenAi),
}));

import {classifyText} from './openAi';

describe('openaAi model', () => {
  describe('classifyText', () => {
    it('should classify text', async () => {
      mockOpenAi.createChatCompletion.mockResolvedValueOnce({
        data: {
          choices: [
            {
              message: {
                content: 'gibberish,non-english',
              },
            },
          ],
        },
      });

      const classifications = await classifyText('some random text');

      expect(mockOpenAi.createChatCompletion).toHaveBeenCalledWith({
        model: 'gpt-4-0613',
        temperature: 0,
        messages: [
          {
            role: 'system',
            content:
              'Classify if text contains religion,illegal drug use,threat,high risk of physical harm,adult,profanity,racist,gibberish,non-english,mostly capital letters,names,persons. Answer with unique lower case comma separated, without space between classifications. Answer with none when nothing matches.',
          },
          {role: 'user', content: 'some random text'},
        ],
      });

      expect(classifications).toEqual(['gibberish', 'non-english']);
    });

    it('returns null on "none" classification', async () => {
      mockOpenAi.createChatCompletion.mockResolvedValueOnce({
        data: {
          choices: [
            {
              message: {
                content: 'none',
              },
            },
          ],
        },
      });

      const classifications = await classifyText('some random text');

      expect(mockOpenAi.createChatCompletion).toHaveBeenCalledWith({
        model: 'gpt-4-0613',
        temperature: 0,
        messages: [
          {
            role: 'system',
            content:
              'Classify if text contains religion,illegal drug use,threat,high risk of physical harm,adult,profanity,racist,gibberish,non-english,mostly capital letters,names,persons. Answer with unique lower case comma separated, without space between classifications. Answer with none when nothing matches.',
          },
          {role: 'user', content: 'some random text'},
        ],
      });

      expect(classifications).toBe(null);
    });

    it('should return array for bogus results', async () => {
      mockOpenAi.createChatCompletion.mockResolvedValueOnce({
        data: {
          choices: [
            {
              message: {
                content: 'Some bogus result',
              },
            },
          ],
        },
      });

      expect(await classifyText('some random text')).toEqual([
        'Some bogus result',
      ]);
    });

    it('returns null on wrong API responses', async () => {
      mockOpenAi.createChatCompletion.mockResolvedValueOnce({
        data: {},
      });

      expect(await classifyText('some random text')).toBe(null);
    });

    it('rejects on API errors', async () => {
      mockOpenAi.createChatCompletion.mockRejectedValueOnce(
        new Error('Some error'),
      );

      await expect(classifyText('some random text')).rejects.toEqual(
        new Error('Some error'),
      );
    });
  });
});
