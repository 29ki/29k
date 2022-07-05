import codePush from 'react-native-code-push';
import CodePushOverlay from './CodePushOverlay';

export {CodePushOverlay};

export default codePush({
  checkFrequency: codePush.CheckFrequency.MANUAL,
});
