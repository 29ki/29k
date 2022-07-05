import fs from 'fs';
import path from 'path';

const getContentByType = type => {
  const dirPath = path.resolve('src', type);
  const dirFiles = fs.readdirSync(dirPath);

  return dirFiles.reduce((files, fileName) => {
    const filePath = path.resolve(dirPath, fileName);
    const fileKey = path.basename(fileName, '.json');
    const file = fs.readFileSync(filePath);
    const fileJSON = JSON.parse(file);

    return {
      ...files,
      [fileKey]: fileJSON,
    };
  }, {});
};

/*
Generates i18n-friendly structure

{
  sv: {
    'UI.Common.Button': {
      saveButton: {
        text: 'Save',
      },
      saveButton_saving: {
        text: 'Saving',
      },
    },
  },
};
*/
const generateI18NResources = content =>
  Object.entries(content).reduce(
    (i18nResources, [namespace, locales]) =>
      Object.entries(locales).reduce(
        (resources, [locale, resource]) => ({
          ...resources,
          [locale]: {
            ...resources[locale],
            [namespace]: resource,
          },
        }),
        i18nResources,
      ),
    {},
  );

const i18nResources = generateI18NResources(getContentByType('ui'));

const data = JSON.stringify(i18nResources);

if (process.argv.length > 2) {
  fs.writeFileSync(process.argv[2], data);
} else {
  process.stdout.write(data);
}
