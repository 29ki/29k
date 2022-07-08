import React from 'react';
import {StyleSheet} from 'react-native';
import codepush from 'react-native-code-push';
import {useRecoilState, useRecoilValue} from 'recoil';
import {AnimatedCircularProgress} from 'react-native-circular-progress';
import {useTranslation} from 'react-i18next';

import Button from '../../../common/components/Buttons/Button';
import {H4} from '../../../common/components/Typography/Heading/Heading';
import {COLORS} from '../../../common/constants/colors';

import {downloadProgressAtom, statusAtom} from '..//state/state';
import {isColdStartedAtom} from '../../appState/state/state';
import useRestartApp from '../hooks/useRestartApp';
import NS from '../../i18n/constants/namespaces';
import {Spacer16} from '../../../common/components/Spacers/Spacer';
import {B1} from '../../../common/components/Typography/Text/Text';
import styled from 'styled-components/native';
import {GUTTERS} from '../../../common/constants/spacings';
import {killSwitchFields} from '../../killSwitch/state/state';

// import * as metrics from '../../lib/metrics';
// import {EVENTS} from '../../constants/metrics';

const {INSTALLING_UPDATE, DOWNLOADING_PACKAGE, UPDATE_INSTALLED} =
  codepush.SyncStatus;

const Container = styled.View({
  ...StyleSheet.absoluteFillObject,
  backgroundColor: 'rgba(0, 0, 0, 0.6)',
  alignItems: 'center',
  justifyContent: 'center',
});

const Prompt = styled.View({
  margin: GUTTERS,
  padding: GUTTERS,
  borderRadius: 16,
  backgroundColor: COLORS.GREY100,
  alignItems: 'center',
});

const Row = styled.View({
  flexDirection: 'row',
});

const CodePushOverlay = () => {
  const {t} = useTranslation(NS.COMPONENT.CODE_PUSH_OVERLAY);

  const restartApp = useRestartApp();

  const status = useRecoilValue(statusAtom);
  const downloadProgress = useRecoilValue(downloadProgressAtom);
  const isColdStarted = useRecoilValue(isColdStartedAtom);
  const [isRequiredUpdate, setRequiresBundleUpdate] = useRecoilState(
    killSwitchFields('requiresBundleUpdate'),
  );

  if (!isRequiredUpdate) {
    return null;
  }

  const handleDismiss = () => {
    //metrics.logEvent(EVENTS.DISMISS_REQUIRED_UPDATE);
    setRequiresBundleUpdate(false);
  };

  const handleRestart = () => {
    //metrics.logEvent(EVENTS.UPDATE_APP_REQUIRED);
    restartApp();
  };

  switch (status) {
    case DOWNLOADING_PACKAGE:
    case INSTALLING_UPDATE:
      return (
        <Container>
          <Prompt>
            <H4>{t('downloading.title')}</H4>
            <Spacer16 />
            <AnimatedCircularProgress
              fill={downloadProgress * 100}
              size={30}
              width={2}
              rotation={0}
              tintColor={COLORS.GREY800}
              backgroundColor={COLORS.GREY400}
              lineCap="round"
            />
            <Spacer16 />
            <B1>{t('downloading.text')}</B1>
          </Prompt>
        </Container>
      );

    case UPDATE_INSTALLED:
      return (
        <Container>
          <Prompt>
            <H4>{t('install.title')}</H4>
            <Spacer16 />
            <B1>{t('install.text')}</B1>
            <Spacer16 />
            <Row>
              {!isColdStarted && (
                <>
                  <Button onPress={handleDismiss}>
                    {t('install.dismiss_button')}
                  </Button>
                  <Spacer16 />
                </>
              )}
              <Button onPress={handleRestart} primary>
                {t('install.restart_button')}
              </Button>
            </Row>
          </Prompt>
        </Container>
      );

    default:
      return null;
  }
};

export default CodePushOverlay;
