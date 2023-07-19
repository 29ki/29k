import {Configuration, OpenAIApi} from 'openai';
import config from '../lib/config';

const {OPENAI_API_KEY} = config;

const configuration = new Configuration({
  apiKey: OPENAI_API_KEY,
});

const openAi = new OpenAIApi(configuration);

const classifications = [
  'religion',
  'illegal drug use',
  'threat',
  'high risk of physical harm',
  'adult',
  'profanity',
  'racist',
  'gibberish',
  'non-english',
  'mostly capital letters',
  'names',
  'persons',
];
const prompt = `Classify if text contains ${classifications.join(
  ',',
)}. Answer with unique lower case comma separated, without space between classifications. Answer with none when nothing matches.`;

export const classifyText = async (text: string) => {
  const completion = await openAi.createChatCompletion({
    model: 'gpt-4-0613', //'gpt-3.5-turbo-0613',
    temperature: 0, // Lower = less random, more deterministic
    messages: [
      {role: 'system', content: prompt},
      {role: 'user', content: text},
    ],
  });

  const content = completion?.data?.choices?.[0]?.message?.content;

  return content && content !== 'none' ? content?.split(',') : null;
};
