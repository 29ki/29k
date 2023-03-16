import Handlebars from 'handlebars';
import memoize from 'fast-memoize';
import mjml from 'mjml';

import {htmlLight, textWihtoutUnsubscribe} from './template';
import {ReportParams} from '../../api/report';

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

export const renderUserReportMjml = ({
  body,
  content,
  params,
}: {
  body: string;
  content: string;
  params: ReportParams;
}) => {
  const template = htmlTemplate();
  return htmlLight(template({body, content, params}));
};

export const renderUserReportHtml = ({
  body,
  content,
  params,
}: {
  body: string;
  content: string;
  params: ReportParams;
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
  params: ReportParams;
}) => {
  const template = textTemplate();
  return textWihtoutUnsubscribe(template({body, content, params}));
};
