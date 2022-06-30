import React, {useState} from 'react';
import {StyleSheet, View} from 'react-native';
import codepush from 'react-native-code-push';
import {useRecoilValue} from 'recoil';
import {AnimatedCircularProgress} from 'react-native-circular-progress';

import Button from '../common/components/Buttons/Button';
import {Heading4} from '../common/components/Typography/Heading/Heading';
import {COLORS} from '../common/constants/colors';

import useRestartApp from './hooks/useRestartApp';
import {
  downloadProgressAtom,
  isColdStartedAtom,
  statusAtom,
} from './state/state';

// import * as metrics from '../../lib/metrics';
// import {EVENTS} from '../../constants/metrics';

// import GUTTERS from '../../styles/gutters.style';
// import {COLORS} from '../../styles/theme.style';
// import {Spacer16} from '../Spacer/Spacer';
// import {Heading4} from '../Typography/Heading/Heading';
// import {BodyNormal} from '../Typography/Text/Text';
// import {CodePushContext} from './CodePushProvider';
// import {useTranslation} from 'react-i18next';
// import {NS} from '../../constants/i18n';
// import Row from '../Layout/Row/Row';
// import {useDispatch, useSelector} from 'react-redux';
// import {getRequiresBundleUpdate} from '../../store/killSwitch/selectors';
// import {setRequiresBundleUpdate} from '../../store/killSwitch/reducer';

const {INSTALLING_UPDATE, DOWNLOADING_PACKAGE, UPDATE_INSTALLED} =
  codepush.SyncStatus;

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'rgba(0,0,0,0.6)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  prompt: {
    margin: 20,
    padding: 20,
    borderRadius: 16,
    backgroundColor: COLORS.GREY100,
    alignItems: 'center',
  },
  text: {
    color: COLORS.PLUM100,
  },
});

const CodePushOverlay = () => {
  const restartApp = useRestartApp();

  const status = useRecoilValue(statusAtom);
  const downloadProgress = useRecoilValue(downloadProgressAtom);
  const isColdStarted = useRecoilValue(isColdStartedAtom);

  const [isRequiredUpdate, setRequiresBundleUpdate] = useState(true);

  if (!isRequiredUpdate) {
    return null;
  }

  const handleDismiss = () => {
    setRequiresBundleUpdate(false);
  };

  const handleRestart = () => {
    restartApp();
  };

  switch (status) {
    case DOWNLOADING_PACKAGE:
    case INSTALLING_UPDATE:
      return (
        <View style={[styles.container, styles.prompt]}>
          <Heading4 style={styles.text}>Downloading</Heading4>
          <AnimatedCircularProgress
            fill={downloadProgress * 100}
            size={30}
            width={2}
            rotation={0}
            tintColor={COLORS.GREY800}
            backgroundColor={COLORS.GREY400}
            lineCap="round"
          />
        </View>
      );

    case UPDATE_INSTALLED:
      return (
        <View style={styles.container}>
          <View style={styles.prompt}>
            <Heading4 style={styles.text}>install.title</Heading4>

            {!isColdStarted && (
              <>
                <Button onPress={handleDismiss} title="Dismiss" />
              </>
            )}
            <Button onPress={handleRestart} title="Restart" />
          </View>
        </View>
      );

    default:
      return null;
  }
};

export default CodePushOverlay;
