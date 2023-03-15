import Handlebars from 'handlebars';
import memoize from 'fast-memoize';
import mjml from 'mjml';
import {remark} from 'remark';
import html from 'remark-html';
import strip from 'strip-markdown';

import {htmlLight, textWihtoutUnsubscribe} from './template';

const remarkHtml = remark().use(html);
const remarkStrip = remark().use(strip);

export const parseMarkdown = (str: string) =>
  remarkHtml.processSync(str).toString();

export const stripMarkdown = (str: string) =>
  remarkStrip.processSync(str).toString();

const htmlTemplate = memoize(() =>
  Handlebars.compile(`
<mj-text>{{{body}}}</mj-text>
<mj-text>{{content}}</mj-text>
<mj-table>
{{#each params}}
  <tr>
    <td>{{this.key}}</td>
    <td>{{this.value}}</td>
  </tr>
{{/each}}
</mj-table>`),
);

const textTemplate = memoize(() =>
  Handlebars.compile(`
{{{body}}}

{{{content}}}

{{#each params}}
{{{this.key}}}: {{{this.value}}}
{{/each}}`),
);

export type Params = {
  screen: string;
  key: string;
  model: string;
  os: string;
  osVersion: number;
  nativeVersion: string;
  bundleVersion: number;
  gitCommit: string;
};

export const renderUserReportMjml = ({
  body,
  content,
  params,
}: {
  body: string;
  content: string;
  params: Params;
}) => {
  const template = htmlTemplate();
  return htmlLight(template({body: parseMarkdown(body), content, params}));
};

export const renderUserReportHtml = ({
  body,
  content,
  params,
}: {
  body: string;
  content: string;
  params: Params;
}) => {
  return mjml(renderUserReportMjml({body, content, params})).html;
};

export const renderUserReportText = ({
  body,
  content,
  params,
}: {
  body: string;
  content: string;
  params: Params;
}) => {
  const template = textTemplate();
  return textWihtoutUnsubscribe(
    template({body: stripMarkdown(body), content, params}),
  );
};
