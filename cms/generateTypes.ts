import * as fs from 'fs';
import * as process from 'child_process';
import {createNetlifyTypes} from 'netlify-ts';
import {Collection} from 'netlify-ts/lib/types';
import {exercises, contributors, files} from './src/collections/collections';

const OUTPUT_PATH = '../shared/src/types/generated';

const clean = (input: string) => input.replaceAll(/_|-|\./g, '');

const createTypeFile =
  (createUnion = false) =>
  (collection: Collection) => {
    const fileName = collection.label_singular
      ? collection.label_singular.replace(/^[a-z]/g, v => v.toUpperCase())
      : collection.label;
    const path = `${OUTPUT_PATH}/${fileName}.ts`;
    const types = createNetlifyTypes(
      {
        collections: [collection] as unknown as Array<Collection>,
      },
      {label: true, capitalize: true, delimiter: ''},
    );

    let cleanedTypes = clean(types);

    // Create a union of all generated UI types
    if (createUnion) {
      cleanedTypes = `${cleanedTypes}\n\nexport type UIComponent = ${cleanedTypes
        .match(/(?<=export interface )[A-Z][a-z]*/gi)
        ?.join(' | ')}`;
    }

    fs.writeFileSync(path, cleanedTypes);
    process.exec(`yarn prettier --write ${path}`);
  };

const main = () => {
  ([exercises, contributors] as unknown as Array<Collection>).forEach(
    createTypeFile(),
  );

  ([files] as unknown as Array<Collection>).forEach(createTypeFile(true));
};

main();
