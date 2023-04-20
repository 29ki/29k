import React from 'react';
import codePush from 'react-native-code-push';
import useAppVersion from '../../../../lib/appState/hooks/useAppVersion';
import {Body12, Body14} from '../../../../lib/components/Typography/Body/Body';
import {InfoIcon, RewindIcon} from '../../../../lib/components/Icons';
import useCheckForUpdate from '../../../../lib/codePush/hooks/useCheckForUpdate';
import {ActivityIndicator, View} from 'react-native';
import {AnimatedCircularProgress} from 'react-native-circular-progress';
import {COLORS} from '../../../../../../shared/src/constants/colors';
import useCodePushState from '../../../../lib/codePush/state/state';
import {useTranslation} from 'react-i18next';
import useRestartApp from '../../../../lib/codePush/hooks/useRestartApp';
import styled from 'styled-components/native';
import TouchableOpacity from '../../../../lib/components/TouchableOpacity/TouchableOpacity';
import ActionIconItem from '../../../../lib/components/ActionList/ActionIconItem';

const {CHECKING_FOR_UPDATE, DOWNLOADING_PACKAGE, UP_TO_DATE, UPDATE_INSTALLED} =
  codePush.SyncStatus;

const Spinner = () => <ActivityIndicator size="small" color="black" />;

const Progress = () => {
  const downloadProgress = useCodePushState(state => state.downloadProgress);
  return (
    <AnimatedCircularProgress
      fill={downloadProgress * 100}
      size={20}
      width={2}
      rotation={0}
      tintColor={COLORS.BLACK}
      backgroundColor={COLORS.GREYLIGHT}
      lineCap="round"
    />
  );
};

const Underline = styled.Text({
  textDecorationLine: 'underline',
});

const AppVersionActionButton = () => {
  const {t} = useTranslation('Component.AppVersion');
  const version = useAppVersion();
  const status = useCodePushState(state => state.status);
  const checkForUpdate = useCheckForUpdate();
  const restartApp = useRestartApp();

  const versionString = `Version ${version}`;

  switch (status) {
    case CHECKING_FOR_UPDATE:
      return (
        <TouchableOpacity onPress={checkForUpdate}>
          <ActionIconItem Icon={Spinner}>
            <View>
              <Body14>{versionString}</Body14>
              <Body12>{t('checking.status')}</Body12>
            </View>
          </ActionIconItem>
        </TouchableOpacity>
      );

    case DOWNLOADING_PACKAGE:
      return (
        <ActionIconItem Icon={Progress}>
          <View>
            <Body14>{versionString}</Body14>
            <Body12>{t('downloading.status')}</Body12>
          </View>
        </ActionIconItem>
      );

    case UPDATE_INSTALLED:
      return (
        <TouchableOpacity onPress={restartApp}>
          <ActionIconItem Icon={RewindIcon}>
            <View>
              <Body14>{versionString}</Body14>
              <Body12>
                {t('installed.status')}
                <Underline>{t('installed.action')}</Underline>
              </Body12>
            </View>
          </ActionIconItem>
        </TouchableOpacity>
      );

    case UP_TO_DATE:
    default:
      return (
        <TouchableOpacity onPress={checkForUpdate}>
          <ActionIconItem Icon={InfoIcon}>
            <View>
              <Body14>{versionString}</Body14>
              <Body12>
                {t('upToDate.status')}
                <Underline>{t('upToDate.action')}</Underline>
              </Body12>
            </View>
          </ActionIconItem>
        </TouchableOpacity>
      );
  }
};

export default AppVersionActionButton;
