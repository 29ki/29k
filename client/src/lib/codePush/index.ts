import codePush from '@revopush/react-native-code-push';
import CodePushOverlay from './components/CodePushOverlay';

export {CodePushOverlay};

export default codePush({
  checkFrequency: codePush.CheckFrequency.MANUAL,
});
