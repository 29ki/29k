import * as fs from 'fs';
import * as process from 'child_process';
import {createNetlifyTypes} from 'netlify-ts';
import {Collection} from 'netlify-ts/lib/types';
import {exercises, contributors} from './src/collections/collections';

const OUTPUT_PATH = '../shared/src/types/CmsTypes.ts';

const clean = (input: string) => input.replaceAll(/_|-|\./g, '');
const addEslintDisables = (input: string) =>
  `/* eslint-disable @typescript-eslint/no-explicit-any */\n${input}`;

const main = () => {
  const types = createNetlifyTypes(
    {
      collections: [exercises, contributors] as unknown as Array<Collection>,
    },
    {label: false, capitalize: true},
  );

  const cleanedTypes = clean(types);
  const withDisables = addEslintDisables(cleanedTypes);

  fs.writeFileSync(OUTPUT_PATH, withDisables);
  process.exec(`yarn prettier --write ${OUTPUT_PATH}`);
};

main();
