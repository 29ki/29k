import {templates} from '../templates/editorTexts.json';

const templateOptions = templates.map(template => ({
  label: `${template.name} - ${template.text}`,
  value: template.text,
}));

const templatesSubPattern = templates
  .map(template => template.text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))
  .join('|');

const templatesPattern = new RegExp(`(${templatesSubPattern})(\\s|$)`);

const textTemplates = {
  id: 'textTemplate',
  label: '🔖 Text template',
  fields: [
    {
      name: 'template',
      label: 'Template',
      widget: 'select',
      options: templateOptions,
    },
  ],
  pattern: templatesPattern,
  fromBlock: (match: RegExpMatchArray) => ({
    template: match[1],
  }),
  toBlock: (obj: {template: string}) => obj.template,
  toPreview: (obj: {template: string}) => obj.template,
};

export default textTemplates;
