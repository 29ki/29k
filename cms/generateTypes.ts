import * as fs from 'fs';
import * as process from 'child_process';
import createCMSTypes from 'netlify-ts';
import {Collection} from 'netlify-ts/lib/types';
import {
  categories,
  collections,
  tags,
  exercises,
} from './src/collections/collections';

const OUTPUT_PATH = '../shared/src/types/generated';

const createTypeFile = (collection: Collection) => {
  const fileName = collection.label_singular
    ? collection.label_singular.replace(/^[a-z]/g, v => v.toUpperCase())
    : collection.label;
  const path = `${OUTPUT_PATH}/${fileName}.ts`;
  const types = createCMSTypes(
    {
      collections: [collection] as unknown as Array<Collection>,
    },
    {label: true, capitalize: true, delimiter: ''},
  );

  fs.writeFileSync(path, types);
  process.exec(`yarn prettier --write ${path}`);
};

const main = () => {
  ([categories] as unknown as Array<Collection>).forEach(createTypeFile);
  ([collections] as unknown as Array<Collection>).forEach(createTypeFile);
  ([tags] as unknown as Array<Collection>).forEach(createTypeFile);
  ([exercises] as unknown as Array<Collection>).forEach(createTypeFile);
};

main();
