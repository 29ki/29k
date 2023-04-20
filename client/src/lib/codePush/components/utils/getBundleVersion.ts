import codePush from 'react-native-code-push';

const getBundleVersion = async () => {
  const update = await codePush.getUpdateMetadata();
  if (update && 'label' in update) {
    return parseInt(update.label.replace(/[^\d]*/, ''), 10);
  }
};

export default getBundleVersion;
